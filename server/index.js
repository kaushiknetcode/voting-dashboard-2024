import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { db } from './db/index.js';
import authRoutes from './routes/auth.routes.js';
import dataRoutes from './routes/data.routes.js';
import statsRoutes from './routes/stats.routes.js';
import votingDateRoutes from './routes/votingDate.routes.js';
import systemRoutes from './routes/system.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://dashboard.ersecretballot.in']
    : ['http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/voting-dates', votingDateRoutes);
app.use('/api/system', systemRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Error handling
app.use(errorHandler);

// Test database connection
db.query('SELECT NOW()')
  .then(() => {
    logger.info('Connected to PostgreSQL');
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Database connection error:', err);
    process.exit(1);
  });