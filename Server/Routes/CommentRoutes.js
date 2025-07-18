import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
} from '../Controllers/commentController.js';

const router = express.Router();

router.post('/createComment', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/getComments', verifyToken, getAllComments);

export default router;
