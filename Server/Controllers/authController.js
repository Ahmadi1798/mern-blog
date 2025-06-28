import admin from '../utils/firebaseAdmin.js';
import User from '../Models/userModel.js';
import bcrypt from 'bcryptjs';

import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  const { username, email } = req.body;
  if (!username || !email || username === '' || email === '') {
    return next(errorHandler(400, 'Please fill all the fields'));
  }
  try {
    const user = await User.create({ username, email });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  const { email } = req.body;
  if (!email || email === '') {
    return next(errorHandler(400, 'Please provide an email'));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(401, 'User not found'));
    }
    // Generate JWT for session if needed
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // User stays logged in for 1 day
    );
    const { ...userData } = user._doc;
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(userData);
  } catch (error) {
    next(error);
  }
};
export const googleAuth = async (req, res, next) => {
  const { name, email, image } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: name,
        email,
        profilePicture: image,
      });
    }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // User stays logged in for 1 day
    );
    const { ...userData } = user._doc;
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(userData);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  console.log('Deleting user with ID:', req.params.userId);
  console.log('Current user ID:', req.user.id);
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    // Find user to get email
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    await User.findByIdAndDelete(req.params.userId);

    // Delete from Firebase Auth
    try {
      const userRecord = await admin.auth().getUserByEmail(user.email);
      await admin.auth().deleteUser(userRecord.uid);
    } catch (firebaseError) {
      console.log(
        'Firebase user not found or already deleted:',
        firebaseError.message
      );
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been logged out ');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to get users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const pageSize = parseInt(req.query.pageSize) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(pageSize);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    const totalUsers = await User.countDocuments();
    res
      .status(200)
      .json({ users, totalUsers, usersWithoutPassword, lastMonthUsers });
  } catch (error) {}
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User Not Found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
