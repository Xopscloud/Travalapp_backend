import type { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { BlogModel } from '../models/Blog';
import { deleteUpload } from '../utils/uploads';

const blogSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  tag: z.string()
});

const blogUpdateSchema = blogSchema.partial();

export async function createBlog(req: Request, res: Response) {
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

export async function listBlogs(_req: Request, res: Response) {
  const blogs = await BlogModel.find().sort({ createdAt: -1 });
  return res.json(blogs);
}

export async function updateBlog(req: Request, res: Response) {
  const parsed = blogUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const blog = await BlogModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  return res.json(blog);
}

export async function deleteBlog(req: Request, res: Response) {
  const blog = await BlogModel.findByIdAndDelete(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  await deleteUpload(blog.imageUrl);
  return res.json({ success: true, deletedId: blog.id });
}
