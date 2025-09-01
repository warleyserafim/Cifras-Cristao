import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import artistRoutes from './routes/artist.routes';
import musicRoutes from './routes/music.routes';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import tagRoutes from './routes/tag.routes';
import userRoutes from './routes/user.routes';
import commentRoutes from './routes/comment.routes';
import analysisRoutes from './routes/analysis.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.send('API do Cifras Club Clone está no ar!');
});

app.use('/api/artists', artistRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analyze', analysisRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
