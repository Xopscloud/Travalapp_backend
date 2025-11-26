import { Router } from 'express';
import { getDestinationSummaries } from '@/lib/destinations.js';
const router = Router();
router.get('/', async (_req, res, next) => {
    try {
        const destinations = await getDestinationSummaries();
        res.json(destinations);
    }
    catch (error) {
        next(error);
    }
});
export default router;
