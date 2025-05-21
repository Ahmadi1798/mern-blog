import express from 'express';
import { createPost } from '../Controllers/postController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createPost);

export default router;
