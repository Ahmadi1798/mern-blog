import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment } from '../Controllers/commentController.js';

const router = express.Router();

router.post('/createComment', verifyToken, createComment);

export default router;
