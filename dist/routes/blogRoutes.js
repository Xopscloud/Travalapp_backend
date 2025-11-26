import { Router } from 'express';
import { createBlog, listBlogs } from '@/controllers/blogController.js';
import { upload } from '@/middleware/upload.js';
import { requireAuth } from '@/middleware/requireAuth.js';
const router = Router();
router.get('/', listBlogs);
router.post('/', requireAuth, upload.single('image'), createBlog);
export default router;
