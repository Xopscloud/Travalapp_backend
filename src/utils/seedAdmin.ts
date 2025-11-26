import bcrypt from 'bcryptjs';
import { AdminModel } from '../models/Admin';
import { env } from '../config/env';

export async function ensureAdminExists() {
  const existing = await AdminModel.findOne({ email: env.adminEmail });
  if (existing) {
    return;
  }
  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  await AdminModel.create({ email: env.adminEmail, passwordHash });
}
