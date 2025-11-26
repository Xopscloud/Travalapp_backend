import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { BlogModel } from '@/models/Blog.js';
const blogSchema = z.object({
    title: z.string(),
    excerpt: z.string(),
    tag: z.string()
});
export async function createBlog(req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'Image is required' });
    }
    const parsed = blogSchema.safeParse(req.body);
    if (!parsed.success) {
        await fs.unlink(file.path).catch(() => undefined);
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const relativePath = '/uploads/' + path.basename(file.path);
    const blog = await BlogModel.create({ ...parsed.data, imageUrl: relativePath });
    return res.status(201).json(blog);
}
export async function listBlogs(_req, res) {
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    return res.json(blogs);
}
