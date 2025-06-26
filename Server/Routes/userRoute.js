import express from 'express';
import { updateUser, userController } from '../Controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put('/users/:userId', verifyToken, updateUser);

export default router;
