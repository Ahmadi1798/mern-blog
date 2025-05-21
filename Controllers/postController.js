import Post from '../Models/postModel.js';
import { errorHandler } from '../utils/error.js';

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please fill all the fields'));
  }

  const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
    console.log('Post created:', savedPost);
  } catch (error) {
    next(error);
  }
};
