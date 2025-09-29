import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import appointmentRoutes from './routes/appointments.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true })); // tighten in prod

// Static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/healthcheck', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/appointments', appointmentRoutes);

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
