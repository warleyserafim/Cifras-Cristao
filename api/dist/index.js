"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const artist_routes_1 = __importDefault(require("./routes/artist.routes"));
const music_routes_1 = __importDefault(require("./routes/music.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const tag_routes_1 = __importDefault(require("./routes/tag.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const analysis_routes_1 = __importDefault(require("./routes/analysis.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api', (req, res) => {
    res.send('API do Cifras Club Clone está no ar!');
});
app.use('/api/artists', artist_routes_1.default);
app.use('/api/music', music_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/tags', tag_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/comments', comment_routes_1.default);
app.use('/api/analyze', analysis_routes_1.default);
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
