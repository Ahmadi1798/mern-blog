import express from 'express';
import { createPost, getPosts } from '../Controllers/postController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createPost);
router.get('/getPosts', getPosts);

export default router;
