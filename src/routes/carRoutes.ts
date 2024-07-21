import { Router } from 'express';
import carController from '../controllers/carController';

const router = Router();

router.post('/', carController.getCarInfo);

export default router;