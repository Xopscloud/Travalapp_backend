import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import momentRoutes from './routes/momentRoutes';
import blogRoutes from './routes/blogRoutes';
import photoRoutes from './routes/photoRoutes';
import destinationRoutes from './routes/destinationRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve(env.uploadRoot)));

app.use('/api/auth', authRoutes);
app.use('/api/moments', momentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/admin', adminRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
