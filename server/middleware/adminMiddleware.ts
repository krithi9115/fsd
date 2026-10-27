import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.ts';

export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required to view or manage this resource.',
    });
    return;
  }

  next();
}
