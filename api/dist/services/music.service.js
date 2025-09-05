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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMusic = exports.updateMusic = exports.createMusic = exports.getMusicById = exports.getAllMusic = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getAllMusic = (tag, searchQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {};
    if (tag) {
        where.tags = { some: { tag: { name: tag } } };
    }
    if (searchQuery) {
        where.OR = [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { artist: { name: { contains: searchQuery, mode: 'insensitive' } } },
        ];
    }
    return yield prisma_1.default.music.findMany({
        where,
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
    });
});
exports.getAllMusic = getAllMusic;
const getMusicById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.music.findUnique({
        where: { id },
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
    });
});
exports.getMusicById = getMusicById;
const createMusic = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { tagIds } = data, musicData = __rest(data, ["tagIds"]);
    return yield prisma_1.default.music.create({
        data: Object.assign(Object.assign({}, musicData), { tags: {
                create: (tagIds === null || tagIds === void 0 ? void 0 : tagIds.map(tagId => ({
                    tag: { connect: { id: tagId } }
                }))) || [],
            } }),
    });
});
exports.createMusic = createMusic;
const updateMusic = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { tagIds } = data, musicData = __rest(data, ["tagIds"]);
    // Handle tag updates: disconnect existing and connect new ones
    if (tagIds !== undefined) {
        yield prisma_1.default.musicTag.deleteMany({ where: { musicId: id } }); // Disconnect all existing
    }
    return yield prisma_1.default.music.update({
        where: { id },
        data: Object.assign(Object.assign({}, musicData), { tags: tagIds !== undefined ? {
                create: tagIds.map(tagId => ({
                    tag: { connect: { id: tagId } }
                })),
            } : undefined }),
    });
});
exports.updateMusic = updateMusic;
const deleteMusic = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete associated MusicTag entries first
    yield prisma_1.default.musicTag.deleteMany({ where: { musicId: id } });
    return yield prisma_1.default.music.delete({
        where: { id },
    });
});
exports.deleteMusic = deleteMusic;
