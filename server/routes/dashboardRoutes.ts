import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(authMiddleware);
router.get('/stats', getDashboardStats);

export default router;
