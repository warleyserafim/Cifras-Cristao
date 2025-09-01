import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios'; // Import axios

const execPromise = promisify(exec);

export const analyzeMusic = async (youtubeUrl: string) => {
  const tempDir = path.join(__dirname, '../../tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const audioFileId = `audio_${Date.now()}`;
  const audioFilePath = path.join(tempDir, `${audioFileId}.wav`);
  const audioFileOutputPath = path.join(tempDir, audioFileId);
  const pythonScriptPath = path.join(__dirname, '../utils/chord_recognizer.py');

  let videoTitle = '';
  let videoArtist = '';

  try {
    // 0. Get video metadata using yt-dlp
    console.log(`Getting metadata for ${youtubeUrl}...`);
    const { stdout: metaStdout, stderr: metaStderr } = await execPromise(
      `yt-dlp --print-json --cookies /tmp/cookies.txt "${youtubeUrl}"`,
      { maxBuffer: 1024 * 1024 * 10 } // Increase buffer to 10MB
    );
    if (metaStderr) console.error('yt-dlp metadata stderr:', metaStderr);
    const metadata = JSON.parse(metaStdout);
    videoArtist = metadata.artist || metadata.channel || ''; // Use channel as fallback for artist

    // Try to get a clean title, preferring metadata.track
    let rawTitle = metadata.track || metadata.title || '';

    // Clean title by removing extra tags like (Official Video), [HD], etc.
    let cleanedTitle = rawTitle.replace(/\s*\(.+?\)|\[.+?\]/g, '').trim();

    // If artist is found in the title, remove it.
    if (videoArtist && cleanedTitle.toLowerCase().startsWith(videoArtist.toLowerCase())) {
      // Remove artist name and any leading separators like ' - '
      cleanedTitle = cleanedTitle.substring(videoArtist.length).replace(/^\s*-\s*/, '').trim();
    }
    
    videoTitle = cleanedTitle;

    // 1. Download audio using yt-dlp
    console.log(`Downloading audio from ${youtubeUrl} to ${audioFilePath}...`);
    const { stdout: downloadStdout, stderr: downloadStderr } = await execPromise(
      `yt-dlp -x --audio-format wav --cookies /tmp/cookies.txt -o "${audioFileOutputPath}" "${youtubeUrl}"`,
      { maxBuffer: 1024 * 1024 * 50 } // Increase buffer to 50MB for audio download output
    );
    console.log('yt-dlp stdout:', downloadStdout);
    if (downloadStderr) console.error('yt-dlp stderr:', downloadStderr);

    // 2. Run Python chord recognition script
    console.log(`Running chord recognition on ${audioFilePath}...`);
    const { stdout: pythonStdout, stderr: pythonStderr } = await execPromise(
      `python "${pythonScriptPath}" "${audioFilePath}"`,
      { maxBuffer: 1024 * 1024 * 10 } // Increase buffer to 10MB for Python script output
    );
    console.log('Python script stdout:', pythonStdout);
    if (pythonStderr) {
      console.error('Python script stderr:', pythonStderr);
      throw new Error(`Python script error: ${pythonStderr}`);
    }

    const chordsResultRaw = JSON.parse(pythonStdout);

    // Check if python script returned an error
    if (chordsResultRaw.error) {
      throw new Error(`Chord recognition failed: ${chordsResultRaw.error}`);
    }
    const chordsResult = chordsResultRaw;

    // 3. Fetch timed lyrics from Lrclib.net
    let plainLyrics = '';
    let syncedLyrics = '';
    if (videoTitle && videoArtist) {
      console.log(`Fetching timed lyrics for ${videoArtist} - ${videoTitle}...`);
      try {
        const response = await axios.get('https://lrclib.net/api/search', {
          params: {
            artist_name: videoArtist,
            track_name: videoTitle,
          },
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
      syncedLyrics: syncedLyrics,
      plainLyrics: plainLyrics || 'Lyrics not found.',
    };
  } finally {
    // Clean up temporary audio file
    if (fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath);
      console.log(`Cleaned up ${audioFilePath}`);
    }
  }
};