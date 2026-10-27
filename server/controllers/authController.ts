import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.ts';
import { generateToken } from '../utils/token.ts';
import { validateRegistration, validateLogin } from '../utils/validators.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const validation = validateRegistration({ name, email, password, confirmPassword });
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors: validation.errors,
      });
      return;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
        errors: { email: 'Email address is already in use.' },
      });
      return;
    }

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
    });

    const token = generateToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Registration service error: ' + error.message,
    });
  }
}

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.',
        errors: validation.errors,
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Login service error: ' + error.message,
    });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile: ' + error.message,
    });
  }
}

export async function logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please clear client-side token.',
  });
}
