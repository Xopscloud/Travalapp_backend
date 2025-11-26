import { Router } from 'express';
import { listPhotos } from '@/controllers/photoController.js';
import { requireAuth } from '@/middleware/requireAuth.js';
import { upload } from '@/middleware/upload.js';
import { handlePhotoUpload } from '@/controllers/photoUploadController.js';
const router = Router();
router.get('/', listPhotos);
router.post('/', requireAuth, upload.single('image'), handlePhotoUpload);
export default router;
