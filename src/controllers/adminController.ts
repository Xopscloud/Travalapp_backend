import type { Request, Response } from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { MomentModel } from '../models/Moment';
import { PhotoModel } from '../models/Photo';
import { BlogModel } from '../models/Blog';
import { env } from '../config/env';

export async function purgeContent(_req: Request, res: Response) {
  const uploadDir = path.resolve(env.uploadRoot);

  const [momentResult, photoResult, blogResult] = await Promise.all([
    MomentModel.deleteMany({}),
    PhotoModel.deleteMany({}),
    BlogModel.deleteMany({})
  ]);

  await fs.rm(uploadDir, { recursive: true, force: true });
  await fs.mkdir(uploadDir, { recursive: true });

  return res.json({
    message: 'All uploaded content deleted successfully.',
    deleted: {
      moments: momentResult.deletedCount ?? 0,
      photos: photoResult.deletedCount ?? 0,
      blogs: blogResult.deletedCount ?? 0
    }
  });
}

