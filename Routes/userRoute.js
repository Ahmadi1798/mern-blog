import express from 'express';
import { userController } from '../Controllers/userController.js';

const router = express.Router();

router.get('/test', userController);

export default router;
