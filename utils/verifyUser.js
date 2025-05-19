import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
// 1st you need to install cookie-parser as well

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'Access token is missing'));
  }
  if (!process.env.JWT_SECRET) {
    return next(errorHandler(500, 'JWT secret is not defined'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Invalid or expired token'));
    }
    req.user = user;
    next();
  });
};
