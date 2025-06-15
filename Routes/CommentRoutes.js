import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createComment,
  getPostComments,
} from '../Controllers/commentController.js';

const router = express.Router();

router.post('/createComment', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);

export default router;
