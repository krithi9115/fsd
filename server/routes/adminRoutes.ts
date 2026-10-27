import { Router } from 'express';
import {
  getAdminStats,
  getAdminUsers,
  getAdminAnalyses,
  getAdminFeedback,
  adminDeleteAnalysis,
} from '../controllers/adminController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { adminMiddleware } from '../middleware/adminMiddleware.ts';

const router = Router();

// Admin routes require both authentication and role === 'admin'
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.get('/analyses', getAdminAnalyses);
router.get('/feedback', getAdminFeedback);
router.delete('/analysis/:id', adminDeleteAnalysis);

export default router;
