import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.resolve(env.uploadRoot);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname) || '.jpg';
    cb(null, `${unique}${extension}`);
  }
});

export const upload = multer({ storage });
