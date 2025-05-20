import express from 'express';
import {
  register,
  login,
  googleAuth,
  deleteUser,
} from '../Controllers/authController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.delete('/delete/:userId', verifyToken, deleteUser);
export default router;
