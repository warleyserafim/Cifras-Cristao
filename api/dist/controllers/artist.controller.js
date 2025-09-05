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
exports.deleteArtist = exports.updateArtist = exports.createArtist = exports.getArtistById = exports.getAllArtists = void 0;
const artistService = __importStar(require("../services/artist.service"));
const getAllArtists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.query.categoryId; // Get categoryId from query
        const artists = yield artistService.getAllArtists(categoryId);
        res.status(200).json(artists);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllArtists = getAllArtists;
const getArtistById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artist = yield artistService.getArtistById(req.params.id);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.status(200).json(artist);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getArtistById = getArtistById;
const createArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // req.body should now contain name, photoUrl, and categoryId
        const artist = yield artistService.createArtist(req.body);
        res.status(201).json(artist);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createArtist = createArtist;
const updateArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artist = yield artistService.updateArtist(req.params.id, req.body);
        res.status(200).json(artist);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateArtist = updateArtist;
const deleteArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield artistService.deleteArtist(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteArtist = deleteArtist;
