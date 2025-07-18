import { now } from 'mongoose';
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

export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 9;
    const startIndex = (page - 1) * pageSize;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category &&
        req.query.category !== 'uncategorized' && {
          category: req.query.category,
        }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };

    const posts = await Post.find(query)
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(pageSize);

    const totalPosts = await Post.countDocuments(query);
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      ...query,
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.params.userId !== req.user.id) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.params.userId !== req.user.id) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
