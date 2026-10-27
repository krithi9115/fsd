import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.ts';
import { Analysis } from '../models/Analysis.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const totalAnalyses = await Analysis.countDocuments({ userId: user._id });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        totalAnalyses,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile: ' + error.message,
    });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, currentPassword, newPassword, confirmNewPassword } = req.body;

    const user = await User.findById(req.user!.id).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Update name if provided
    if (name && typeof name === 'string' && name.trim()) {
      user.name = name.trim();
    }

    // Change password if requested
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ success: false, message: 'Current password is required to change password.' });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password!);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password does not match.' });
        return;
      }

      if (newPassword.length < 8) {
        res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
        return;
      }

      if (newPassword !== confirmNewPassword) {
        res.status(400).json({ success: false, message: 'New passwords do not match.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile: ' + error.message,
    });
  }
}
