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
exports.getFavoriteMusic = exports.removeFavoriteMusic = exports.addFavoriteMusic = exports.updateUser = exports.getUserById = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, profilePhotoUrl: true }, // Exclude password
    });
});
exports.getUserById = getUserById;
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.password) {
        data.password = yield bcryptjs_1.default.hash(data.password, 10);
    }
    return yield prisma_1.default.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true, profilePhotoUrl: true }, // Exclude password
    });
});
exports.updateUser = updateUser;
const addFavoriteMusic = (userId, musicId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.update({
        where: { id: userId },
        data: {
            favorites: {
                connect: { id: musicId },
            },
        },
        select: { id: true, favorites: { select: { id: true } } }, // Return user with favorite music IDs
    });
});
exports.addFavoriteMusic = addFavoriteMusic;
const removeFavoriteMusic = (userId, musicId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.update({
        where: { id: userId },
        data: {
            favorites: {
                disconnect: { id: musicId },
            },
        },
        select: { id: true, favorites: { select: { id: true } } }, // Return user with favorite music IDs
    });
});
exports.removeFavoriteMusic = removeFavoriteMusic;
const getFavoriteMusic = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            favorites: {
                select: {
                    id: true,
                    title: true,
                    tone: true,
                    content: true,
                    videoUrl: true,
                    artist: true,
                    tags: {
                        select: {
                            tag: true,
                        },
                    },
                },
            },
        },
    });
    return (user === null || user === void 0 ? void 0 : user.favorites) || [];
});
exports.getFavoriteMusic = getFavoriteMusic;
