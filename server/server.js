import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import { getDatabase } from './services/sampleDatabase.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dsa_sql_analyzer';

// Initialize sample SQLite database
getDatabase()
  .then(() => {
    console.log('✅ SQLite In-Memory Database initialized with sample schemas');
  })
  .catch((err) => {
    console.warn('⚠️ SQLite init warning:', err.message);
  });

// Attempt MongoDB Connection (Non-blocking fallback)
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 2000
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('ℹ️ MongoDB not detected. Running in high-performance In-Memory Mode (Zero configuration required)');
  });

app.listen(PORT, () => {
  console.log(`🚀 DSA & SQL Code Analyzer Server listening on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available: /api/analyze/cpp, /api/analyze/sql, /api/run/cpp, /api/run/sql, /api/schemas`);
});
