import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import artistRoutes from './routes/artist.routes';

app.get('/api', (req: Request, res: Response) => {
  res.send('API do Cifras Club Clone está no ar!');
});

import musicRoutes from './routes/music.routes';

app.use('/api/artists', artistRoutes);
import authRoutes from './routes/auth.routes';

app.use('/api/music', musicRoutes);
import categoryRoutes from './routes/category.routes';

app.use('/api/auth', authRoutes);
import tagRoutes from './routes/tag.routes';

app.use('/api/categories', categoryRoutes);
import userRoutes from './routes/user.routes';

app.use('/api/tags', tagRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
