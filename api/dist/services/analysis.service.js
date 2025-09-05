"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMusic = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios")); // Import axios
const execPromise = (0, util_1.promisify)(child_process_1.exec);
const analyzeMusic = (youtubeUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const tempDir = path.join(__dirname, '../../tmp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    const audioFilePath = path.join(tempDir, `audio_${Date.now()}.wav`);
    const pythonScriptPath = path.join(__dirname, '../utils/chord_recognizer.py');
    let videoTitle = '';
    let videoArtist = '';
    let lyrics = '';
    try {
        // 0. Get video metadata using yt-dlp
        console.log(`Getting metadata for ${youtubeUrl}...`);
        const { stdout: metaStdout, stderr: metaStderr } = yield execPromise(`yt-dlp --print-json "${youtubeUrl}"`, { maxBuffer: 1024 * 1024 * 10 } // Increase buffer to 10MB
        );
        if (metaStderr)
            console.error('yt-dlp metadata stderr:', metaStderr);
        const metadata = JSON.parse(metaStdout);
        videoTitle = metadata.title || '';
        videoArtist = metadata.artist || metadata.channel || ''; // Use channel as fallback for artist
        // 1. Download audio using yt-dlp
        console.log(`Downloading audio from ${youtubeUrl} to ${audioFilePath}...`);
        const { stdout: downloadStdout, stderr: downloadStderr } = yield execPromise(`yt-dlp -x --audio-format wav -o "${audioFilePath}" "${youtubeUrl}"`, { maxBuffer: 1024 * 1024 * 50 } // Increase buffer to 50MB for audio download output
        );
        console.log('yt-dlp stdout:', downloadStdout);
        if (downloadStderr)
            console.error('yt-dlp stderr:', downloadStderr);
        // 2. Run Python chord recognition script
        console.log(`Running chord recognition on ${audioFilePath}...`);
        const { stdout: pythonStdout, stderr: pythonStderr } = yield execPromise(`python "${pythonScriptPath}" "${audioFilePath}"`, { maxBuffer: 1024 * 1024 * 10 } // Increase buffer to 10MB for Python script output
        );
        console.log('Python script stdout:', pythonStdout);
        if (pythonStderr)
            console.error('Python script stderr:', pythonStderr);
        const chordsResult = JSON.parse(pythonStdout);
        // 3. Fetch lyrics from Lyrics.ovh
        if (videoTitle && videoArtist) {
            console.log(`Fetching lyrics for ${videoArtist} - ${videoTitle}...`);
            try {
                const lyricsResponse = yield axios_1.default.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(videoArtist)}/${encodeURIComponent(videoTitle)}`);
                lyrics = lyricsResponse.data.lyrics || '';
            }
            catch (lyricsError) {
                console.error('Error fetching lyrics:', lyricsError.message);
                lyrics = 'Lyrics not found.';
            }
        }
        else {
            lyrics = 'Could not determine artist/title to fetch lyrics.';
        }
        return {
            title: videoTitle,
            artist: videoArtist,
            chords: chordsResult,
            lyrics: lyrics,
        };
    }
    finally {
        // Clean up temporary audio file
        if (fs.existsSync(audioFilePath)) {
            fs.unlinkSync(audioFilePath);
            console.log(`Cleaned up ${audioFilePath}`);
        }
    }
});
exports.analyzeMusic = analyzeMusic;
