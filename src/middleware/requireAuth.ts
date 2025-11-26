import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

declare module 'express-serve-static-core' {
  interface Request {
    adminId?: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { adminId: string };
    req.adminId = payload.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
