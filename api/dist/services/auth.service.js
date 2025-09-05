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
exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client"); // Import Role enum
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
    const user = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, userData), { password: hashedPassword, role: client_1.Role.USER }),
    });
    return user;
});
exports.register = register;
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { email: credentials.email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(credentials.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    // Include user role in the JWT payload
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '1h',
    });
    return { user, token };
});
exports.login = login;
