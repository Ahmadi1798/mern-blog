import { errorHandler } from '../utils/error.js';
import Comment from '../Models/commentModel.js';

export const createComment = async (req, res, next) => {
  try {
    const { postId, comment, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, 'You are not allowed to create a comment'));
    }
    const newComment = new Comment({
      comment,
      postId,
      userId,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    if (!comments) {
      return next(errorHandler(404, 'No comments found for this post'));
    }
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
