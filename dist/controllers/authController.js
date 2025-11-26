import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '@/models/Admin.js';
import { env } from '@/config/env.js';
import { z } from 'zod';
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
export async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ adminId: admin.id }, env.jwtSecret, { expiresIn: '1d' });
    return res.json({ token });
}
