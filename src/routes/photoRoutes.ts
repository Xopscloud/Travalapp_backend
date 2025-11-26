import { Router } from 'express';
import { deletePhoto, listPhotos, updatePhoto } from '../controllers/photoController';
import { requireAuth } from '../middleware/requireAuth';
import { upload } from '../middleware/upload';
import { handlePhotoUpload } from '../controllers/photoUploadController';

const router = Router();

router.get('/', listPhotos);
router.post('/', requireAuth, upload.single('image'), handlePhotoUpload);
router.patch('/:id', requireAuth, updatePhoto);
router.delete('/:id', requireAuth, deletePhoto);

export default router;
