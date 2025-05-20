import { User } from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';
import bcrypt from 'bcryptjs';
export const userController = (req, res) => {
  res.json({ message: 'User route is working' });
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;

  if (req.user.id !== userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, 'Password should be at least 6 characters long')
      );
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(
          400,
          'Username should be at least between 7 and 20 characters'
        )
      );
    }
  }

  // if (req.body.username !== req.body.username.toLowerCase()) {
  //   return next(errorHandler(400, 'Username should be in lowercase'));
  // }
  // if (!req.body.username.match(/^[a-z0-9]+$/)) {
  //   return next(
  //     errorHandler(
  //       400,
  //       'Username should only contain lowercase letters and numbers'
  //     )
  //   );
  // }

  const { profilePicture, username, email, password } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture, username, email, password },
      { new: true }
    );
    const { password: userPassword, ...userData } = updatedUser._doc;
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'User updated successfully',
      user: userData,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
