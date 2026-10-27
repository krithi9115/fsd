import { Router } from 'express';
import {
  createAnalysis,
  getAnalysisById,
  deleteAnalysis,
  getHistory,
} from '../controllers/analysisController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

// All analysis endpoints are protected by JWT authentication
router.use(authMiddleware);

router.post('/', createAnalysis);
router.get('/history', getHistory);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

export default router;
