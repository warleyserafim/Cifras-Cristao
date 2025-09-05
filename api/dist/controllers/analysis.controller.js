"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMusic = void 0;
const analysis_service_1 = require("../services/analysis.service");
const analyzeMusic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { youtubeUrl } = req.body;
    if (!youtubeUrl) {
        return res.status(400).json({ message: 'YouTube URL is required.' });
    }
    try {
        const result = yield (0, analysis_service_1.analyzeMusic)(youtubeUrl);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error analyzing music:', error);
        res.status(500).json({ message: error.message || 'Failed to analyze music.' });
    }
});
exports.analyzeMusic = analyzeMusic;
