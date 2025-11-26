import { z } from 'zod';
import { PhotoModel } from '@/models/Photo.js';
const filterSchema = z.object({ context: z.enum(['gallery', 'destination']).optional() });
export async function listPhotos(req, res) {
    const parsed = filterSchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { context } = parsed.data;
    const query = context ? { context } : {};
    const photos = await PhotoModel.find(query).sort({ createdAt: -1 });
    return res.json(photos);
}
