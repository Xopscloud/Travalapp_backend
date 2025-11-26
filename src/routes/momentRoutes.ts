import { Router } from 'express';
import { createMoment, listMoments, updateMoment, deleteMoment } from '../controllers/momentController';
import { upload } from '../middleware/upload';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', listMoments);
router.post('/', requireAuth, upload.single('photo'), createMoment);
router.patch('/:id', requireAuth, updateMoment);
router.delete('/:id', requireAuth, deleteMoment);

export default router;
