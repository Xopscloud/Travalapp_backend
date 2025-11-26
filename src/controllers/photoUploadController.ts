import type { Request, Response } from 'express';
import { PhotoModel } from '../models/Photo';
import path from 'path';
import { getDestinationBySlug } from '../lib/destinations';
import { MomentModel } from '../models/Moment';
import { z } from 'zod';

const uploadSchema = z.object({
  uploadType: z.enum(['gallery', 'destination']),
  destinationSlug: z.string().optional()
});

export async function handlePhotoUpload(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Image is required' });
  }

  const parsed = uploadSchema.safeParse({
    uploadType: req.body.uploadType,
    destinationSlug: req.body.destinationSlug
  });

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { uploadType, destinationSlug } = parsed.data;

  let context: 'gallery' | 'destination' = uploadType;
  let relativePath = '/uploads/' + path.basename(file.path);

  if (context === 'destination') {
    if (!destinationSlug) {
      return res.status(400).json({ error: 'Destination slug required' });
    }
    const destination = await getDestinationBySlug(destinationSlug);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    await MomentModel.create({
      traveler: 'Admin',
      title: `Photo upload (${destination.location})`,
      location: destination.location,
      description: `Uploaded via admin photo tool for ${destination.location}.`,
      photoUrl: relativePath,
      travelDate: new Date().toISOString(),
      tags: [],
      mood: 'nature',
      weather: 'Uploaded via admin'
    });
  }

  const derivedTitle = typeof req.body.title === 'string' && req.body.title.trim().length > 0
    ? req.body.title.trim()
    : req.file?.originalname ?? 'Uploaded photo';

  const photo = await PhotoModel.create({
    filePath: relativePath,
    context,
    destinationSlug: destinationSlug ?? null,
    originalName: req.file?.originalname,
    uploadedBy: req.adminId ?? 'Admin',
    title: derivedTitle
  });

  return res.status(201).json(photo);
}
