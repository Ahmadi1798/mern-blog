import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './Routes/userRoute.js';
import authRoute from './Routes/authRoutes.js';
import uploadImageRoute from './Routes/uploadImageRoutes.js';
import postRoutes from './Routes/postRoutes.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1', uploadImageRoute);
app.use('/api/v1/posts', postRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    status: 'error',
    success: false,
    statusCode,
    message,
  });
});

try {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected');
  });
} catch (error) {
  console.log('MongoDB connection error:', error);
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
