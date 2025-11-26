import type { Request, Response } from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { z } from 'zod';
import { MomentModel } from '../models/Moment';
import { deleteUpload } from '../utils/uploads';

const momentSchema = z.object({
  traveler: z.string(),
  title: z.string(),
  location: z.string(),
  description: z.string(),
  travelDate: z.string(),
  tags: z.string().optional(),
  mood: z.enum(['relaxed', 'thrill', 'culture', 'foodie', 'nature']),
  weather: z.string()
});

const momentUpdateSchema = momentSchema.partial();

export async function createMoment(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Image is required' });
  }

  const parsed = momentSchema.safeParse(req.body);
  if (!parsed.success) {
    await fs.unlink(file.path).catch(() => undefined);
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const tags = payload.tags
    ? payload.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const relativePath = '/uploads/' + path.basename(file.path);
  const moment = await MomentModel.create({
    traveler: payload.traveler,
    title: payload.title,
    location: payload.location,
    description: payload.description,
    photoUrl: relativePath,
    travelDate: payload.travelDate,
    tags,
    mood: payload.mood,
    weather: payload.weather
  });

  return res.status(201).json(moment);
}

export async function listMoments(_req: Request, res: Response) {
  const moments = await MomentModel.find().sort({ createdAt: -1 });
  return res.json(moments);
}

export async function updateMoment(req: Request, res: Response) {
  const parsed = momentUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (typeof updates.tags === 'string') {
    updates.tags = updates.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  const moment = await MomentModel.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!moment) {
    return res.status(404).json({ error: 'Moment not found' });
  }

  return res.json(moment);
}

export async function deleteMoment(req: Request, res: Response) {
  const moment = await MomentModel.findByIdAndDelete(req.params.id);
  if (!moment) {
    return res.status(404).json({ error: 'Moment not found' });
  }

  await deleteUpload(moment.photoUrl);
  return res.json({ success: true, deletedId: moment.id });
}
