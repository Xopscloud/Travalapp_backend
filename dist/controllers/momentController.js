import path from 'path';
import { promises as fs } from 'fs';
import { z } from 'zod';
import { MomentModel } from '@/models/Moment.js';
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
export async function createMoment(req, res) {
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
export async function listMoments(_req, res) {
    const moments = await MomentModel.find().sort({ createdAt: -1 });
    return res.json(moments);
}
