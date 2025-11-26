import { Router } from 'express';
import { createBlog, deleteBlog, listBlogs, updateBlog } from '../controllers/blogController';
import { upload } from '../middleware/upload';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', listBlogs);
router.post('/', requireAuth, upload.single('image'), createBlog);
router.patch('/:id', requireAuth, updateBlog);
router.delete('/:id', requireAuth, deleteBlog);

export default router;
