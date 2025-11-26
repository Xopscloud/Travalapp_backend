import type { Request, Response } from 'express';
import { z } from 'zod';
import { PhotoModel } from '../models/Photo';
import { deleteUpload } from '../utils/uploads';

const filterSchema = z.object({ context: z.enum(['gallery', 'destination']).optional() });
const updateSchema = z.object({ title: z.string().min(1).optional() });

export async function listPhotos(req: Request, res: Response) {
  const parsed = filterSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { context } = parsed.data;
  const query = context ? { context } : {};
  const photos = await PhotoModel.find(query).sort({ createdAt: -1 });
  return res.json(photos);
}

export async function updatePhoto(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const updates = parsed.data;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No updates supplied' });
  }

  const photo = await PhotoModel.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!photo) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  return res.json(photo);
}

export async function deletePhoto(req: Request, res: Response) {
  const photo = await PhotoModel.findByIdAndDelete(req.params.id);
  if (!photo) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  await deleteUpload(photo.filePath);
  return res.json({ success: true, deletedId: photo.id });
}
