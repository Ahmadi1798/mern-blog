import { errorHandler } from '../utils/error.js';
import Comment from '../Models/CommentModel.js';

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

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return errorHandler(404, 'Comment is not found');
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.likes.push(req.user.id);
      comment.numberOfLikes += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numberOfLikes - +1;
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'You are not allowed to edit this comment')
      );
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        comment: req.body.comment,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'You are not allowed to delete this comment')
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment Successfully Deleted');
  } catch (error) {}
};
export const getAllComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to view all comments'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const pageSize = parseInt(req.query.pageSize) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find({})
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(pageSize);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};
