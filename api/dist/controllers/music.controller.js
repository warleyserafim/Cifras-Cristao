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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMusic = exports.updateMusic = exports.createMusic = exports.getMusicById = exports.getAllMusic = void 0;
const musicService = __importStar(require("../services/music.service"));
const getAllMusic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = req.query.tag; // Get tag from query
        const searchQuery = req.query.searchQuery; // Get searchQuery from query
        const music = yield musicService.getAllMusic(tag, searchQuery);
        res.status(200).json(music);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllMusic = getAllMusic;
const getMusicById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const music = yield musicService.getMusicById(req.params.id);
        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }
        res.status(200).json(music);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getMusicById = getMusicById;
const createMusic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // req.body should now contain title, tone, content, videoUrl, artistId, tagIds
        const newMusic = yield musicService.createMusic(req.body);
        res.status(201).json(newMusic);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createMusic = createMusic;
const updateMusic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const music = yield musicService.updateMusic(req.params.id, req.body);
        res.status(200).json(music);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateMusic = updateMusic;
const deleteMusic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield musicService.deleteMusic(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteMusic = deleteMusic;
