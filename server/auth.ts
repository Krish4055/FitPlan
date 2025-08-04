import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export interface AuthRequest extends Request {
  userId: string;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(username: string, password: string) {
  const user = await storage.getUserByUsername(username);
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  req.userId = req.session.userId;
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session?.userId) {
    req.userId = req.session.userId;
  }
  next();
}