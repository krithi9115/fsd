import { Router } from 'express';
import { submitFeedback, getFeedback } from '../controllers/feedbackController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(authMiddleware);
router.post('/', submitFeedback);
router.get('/:analysisId', getFeedback);

export default router;
