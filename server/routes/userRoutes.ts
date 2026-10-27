import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
