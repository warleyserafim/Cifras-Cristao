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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArtist = exports.updateArtist = exports.createArtist = exports.getArtistById = exports.getAllArtists = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getAllArtists = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.artist.findMany({
        where: categoryId ? { categoryId } : {},
        include: { category: true }, // Include category
    });
});
exports.getAllArtists = getAllArtists;
const getArtistById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.artist.findUnique({
        where: { id },
        include: { musics: true, category: true }, // Include category
    });
});
exports.getArtistById = getArtistById;
const createArtist = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.artist.create({
        data,
    });
});
exports.createArtist = createArtist;
const updateArtist = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.artist.update({
        where: { id },
        data,
    });
});
exports.updateArtist = updateArtist;
const deleteArtist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Before deleting an artist, delete their associated musics
    yield prisma_1.default.music.deleteMany({
        where: { artistId: id },
    });
    return yield prisma_1.default.artist.delete({
        where: { id },
    });
});
exports.deleteArtist = deleteArtist;
