import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { purgeContent } from '../controllers/adminController';

const router = Router();

router.delete('/purge', requireAuth, purgeContent);

export default router;

