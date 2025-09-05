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
exports.deleteTag = exports.createTag = exports.getAllTags = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getAllTags = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.tag.findMany();
});
exports.getAllTags = getAllTags;
const createTag = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.tag.create({
        data,
    });
});
exports.createTag = createTag;
const deleteTag = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete associated MusicTag entries first
    yield prisma_1.default.musicTag.deleteMany({ where: { tagId: id } });
    return yield prisma_1.default.tag.delete({
        where: { id },
    });
});
exports.deleteTag = deleteTag;
