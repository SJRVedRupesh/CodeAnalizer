import express from 'express';
import cors from 'cors';
import analyzerRoutes from './routes/analyzerRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'DSA & SQL Code Analyzer Backend is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', analyzerRoutes);
app.use('/api', historyRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

export default app;
