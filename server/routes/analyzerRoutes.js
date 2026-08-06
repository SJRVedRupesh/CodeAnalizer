import express from 'express';
import {
  analyzeCppCode,
  analyzeSqlCode,
  runCppCode,
  runSqlCode,
  getSchemas,
  getTemplates
} from '../controllers/analyzerController.js';

const router = express.Router();

// Analysis Endpoints
router.post('/analyze/cpp', analyzeCppCode);
router.post('/analyze/sql', analyzeSqlCode);

// Execution Endpoints
router.post('/run/cpp', runCppCode);
router.post('/run/sql', runSqlCode);

// Schema & Template Utilities
router.get('/schemas', getSchemas);
router.get('/templates', getTemplates);

export default router;
