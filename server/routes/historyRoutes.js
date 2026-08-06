import express from 'express';
import { saveAnalysis, getHistory, clearHistory } from '../controllers/historyController.js';

const router = express.Router();

router.post('/history', saveAnalysis);
router.get('/history', getHistory);
router.delete('/history', clearHistory);

export default router;
