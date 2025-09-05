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
exports.deleteCategory = exports.createCategory = exports.getAllCategories = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.category.findMany();
});
exports.getAllCategories = getAllCategories;
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.category.create({
        data,
    });
});
exports.createCategory = createCategory;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Before deleting a category, delete associated artists and their musics
    const artistsToDelete = yield prisma_1.default.artist.findMany({
        where: { categoryId: id },
        select: { id: true },
    });
    for (const artist of artistsToDelete) {
        yield prisma_1.default.music.deleteMany({
            where: { artistId: artist.id },
        });
    }
    yield prisma_1.default.artist.deleteMany({
        where: { categoryId: id },
    });
    return yield prisma_1.default.category.delete({
        where: { id },
    });
});
exports.deleteCategory = deleteCategory;
