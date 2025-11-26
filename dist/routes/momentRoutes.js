import { Router } from 'express';
import { createMoment, listMoments } from '@/controllers/momentController.js';
import { upload } from '@/middleware/upload.js';
import { requireAuth } from '@/middleware/requireAuth.js';
const router = Router();
router.get('/', listMoments);
router.post('/', requireAuth, upload.single('photo'), createMoment);
export default router;
