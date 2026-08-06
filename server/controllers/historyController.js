/**
 * History & Saved Snippets Controller
 * Handles saving and retrieving analysis history (with MongoDB + in-memory store)
 */

import AnalysisHistory from '../models/AnalysisHistory.js';
import mongoose from 'mongoose';

// In-memory fallback array for presentation portability
const inMemoryHistory = [];

export const saveAnalysis = async (req, res) => {
  try {
    const { language, title, code, summary, complexity, explanationSteps, suggestions } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({ success: false, error: 'Language and code are required.' });
    }

    const newRecord = {
      _id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      language,
      title: title || `${language.toUpperCase()} Analysis`,
      code,
      summary,
      complexity,
      explanationSteps,
      suggestions,
      createdAt: new Date()
    };

    // If MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const saved = await AnalysisHistory.create(newRecord);
        return res.status(201).json({ success: true, record: saved });
      } catch (dbErr) {
        console.warn('MongoDB save warning, falling back to memory:', dbErr.message);
      }
    }

    // Save to memory store
    inMemoryHistory.unshift(newRecord);
    if (inMemoryHistory.length > 50) inMemoryHistory.pop();

    return res.status(201).json({ success: true, record: newRecord });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const records = await AnalysisHistory.find().sort({ createdAt: -1 }).limit(20);
        return res.status(200).json({ success: true, history: records });
      } catch (e) {}
    }

    return res.status(200).json({ success: true, history: inMemoryHistory });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        await AnalysisHistory.deleteMany({});
      } catch (e) {}
    }
    inMemoryHistory.length = 0;
    return res.status(200).json({ success: true, message: 'History cleared successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
