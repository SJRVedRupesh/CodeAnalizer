/**
 * Analysis History Model (Mongoose + In-Memory Fallback)
 */

import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['cpp', 'sql'],
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Analysis'
  },
  code: {
    type: String,
    required: true
  },
  summary: {
    type: Object
  },
  complexity: {
    type: Object
  },
  explanationSteps: {
    type: Array
  },
  suggestions: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

let Model = null;
try {
  Model = mongoose.model('AnalysisHistory', AnalysisSchema);
} catch (e) {
  Model = mongoose.models.AnalysisHistory;
}

export default Model;
