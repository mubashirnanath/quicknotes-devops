import './config/env';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
// import { logger } from './utils/logger';
import { errorHandler, notFound } from './middleware/error';
import authRoutes from './routes/authRoutes';
import notesRoutes from './routes/notesRoutes';
// import { env } from './config/env';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString(), url: process.env.DATABASE_URL }));

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
