import { Router } from 'express';
import carRoutes from './carRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/cars', carRoutes);

export default router;