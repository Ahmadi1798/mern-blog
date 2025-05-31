import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log('Received data:', req.body);

  if (
    !username ||
    !email ||
    !password ||
    password === '' ||
    username === '' ||
    email === ''
  ) {
    next(errorHandler(400, 'Please fill all the fields'));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // we can use hashsync method alternatively
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // alternatively we can use this way to insert date const user = new User({ username, email, password: hashedPassword }); await user.save();
    res.status(201).json(user);
    console.log('User created:', user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'Please fill all the fields'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, 'User not found'));
    }
    const isPasswordMatched = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordMatched) {
      return next(errorHandler(401, 'Invalid credentials'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: userPassword, ...userData } = validUser._doc;
    res
      .status(200)
      .cookie('access_token', token, {
        http: true,
        messages: 'User logged in successfully',
      })
      .json(userData);
    console.log('User logged in:', userData);
  } catch (error) {
    next(error);
  }
};
export const googleAuth = async (req, res, next) => {
  const { name, email, image } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password: userPassword, ...userData } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          messages: 'User logged in successfully',
          data: {
            user: userData,
          },
        })
        .json(userData);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + '@';
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = await User.create({
        username:
          name.toLowerCase().split('').join('') +
          Math.random().toString(9).slice(-3),
        email,
        password: hashedPassword,
        profilePicture: image,
      });
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password: userPassword, ...userData } = newUser._doc;
      res
        .status(201)
        .cookie('access_token', token, {
          httpOnly: true,
          message: 'User ',
          data: {
            userData,
          },
        })
        .json(userData);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  console.log('Deleting user with ID:', req.params.userId);
  console.log('Current user ID:', req.user.id);
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
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
