import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

const execPromise = promisify(exec);

export const analyzeMusic = async (youtubeUrl: string) => {
  // Pasta temporária dentro do container
  const tempDir = path.join(__dirname, '../../tmp'); // ou '/app/tmp'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const audioFileId = `audio_${Date.now()}`;
  const audioFilePath = path.join(tempDir, `${audioFileId}.wav`);
  const audioFileOutputPath = path.join(tempDir, audioFileId);
  const pythonScriptPath = path.join(__dirname, '../utils/chord_recognizer.py');

  // Caminho do Secret File (somente leitura)
  const secretCookiesPath = '/etc/secrets/cookies.txt';

  // Caminho temporário gravável para yt-dlp
  const cookiesPath = path.join(tempDir, 'cookies.txt');

  // Copiar o Secret File para a pasta temporária
  if (!fs.existsSync(secretCookiesPath)) {
    throw new Error(`Secret cookies file not found at ${secretCookiesPath}`);
  }
  fs.copyFileSync(secretCookiesPath, cookiesPath);

  let videoTitle = '';
  let videoArtist = '';

  try {
    // 0. Pegar metadata do vídeo
    console.log(`Getting metadata for ${youtubeUrl}...`);
    const { stdout: metaStdout, stderr: metaStderr } = await execPromise(
      `yt-dlp --print-json --cookies "${cookiesPath}" "${youtubeUrl}"`,
      { maxBuffer: 1024 * 1024 * 10 }
    );
    if (metaStderr) console.error('yt-dlp metadata stderr:', metaStderr);
    const metadata = JSON.parse(metaStdout);
    videoArtist = metadata.artist || metadata.channel || '';
    let rawTitle = metadata.track || metadata.title || '';
    let cleanedTitle = rawTitle.replace(/\s*\(.+?\)|\[.+?\]/g, '').trim();
    if (videoArtist && cleanedTitle.toLowerCase().startsWith(videoArtist.toLowerCase())) {
      cleanedTitle = cleanedTitle.substring(videoArtist.length).replace(/^\s*-\s*/, '').trim();
    }
    videoTitle = cleanedTitle;

    // 1. Baixar áudio
    console.log(`Downloading audio from ${youtubeUrl} to ${audioFilePath}...`);
    const { stdout: downloadStdout, stderr: downloadStderr } = await execPromise(
      `yt-dlp -x --audio-format wav --cookies "${cookiesPath}" -o "${audioFileOutputPath}" "${youtubeUrl}"`,
      { maxBuffer: 1024 * 1024 * 50 }
    );
    console.log('yt-dlp stdout:', downloadStdout);
    if (downloadStderr) console.error('yt-dlp stderr:', downloadStderr);

    // 2. Rodar script Python de reconhecimento de acordes
    console.log(`Running chord recognition on ${audioFilePath}...`);
    const { stdout: pythonStdout, stderr: pythonStderr } = await execPromise(
      `python3 "${pythonScriptPath}" "${audioFilePath}"`,
      { maxBuffer: 1024 * 1024 * 10 }
    );
    console.log('Python script stdout:', pythonStdout);
    if (pythonStderr) {
      console.error('Python script stderr:', pythonStderr);
      throw new Error(`Python script error: ${pythonStderr}`);
    }
    const chordsResultRaw = JSON.parse(pythonStdout);
    if (chordsResultRaw.error) throw new Error(`Chord recognition failed: ${chordsResultRaw.error}`);
    const chordsResult = chordsResultRaw;

    // 3. Buscar letras sincronizadas
    let plainLyrics = '';
    let syncedLyrics = '';
    if (videoTitle && videoArtist) {
      console.log(`Fetching timed lyrics for ${videoArtist} - ${videoTitle}...`);
      try {
        const response = await axios.get('https://lrclib.net/api/search', {
          params: { artist_name: videoArtist, track_name: videoTitle },
        });
        if (response.data && response.data.length > 0) {
          plainLyrics = response.data[0].plainLyrics || '';
          syncedLyrics = response.data[0].syncedLyrics || '';
        }
      } catch (error: any) {
        console.error('Error fetching timed lyrics:', error.message);
      }
    }

    return {
      title: videoTitle,
      artist: videoArtist,
      chords: chordsResult,
      syncedLyrics,
      plainLyrics: plainLyrics || 'Lyrics not found.',
    };
  } finally {
    // Limpar arquivo de áudio temporário
    if (fs.existsSync(audioFilePath)) fs.unlinkSync(audioFilePath);
    // Limpar cookies temporário
    if (fs.existsSync(cookiesPath)) fs.unlinkSync(cookiesPath);
    console.log(`Cleaned up ${audioFilePath} and temporary cookies`);
  }
};
