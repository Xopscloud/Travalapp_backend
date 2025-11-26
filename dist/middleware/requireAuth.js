import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, env.jwtSecret);
        req.adminId = payload.adminId;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
