import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dcnqkqdya',
  api_key: '649626117217931',
  api_secret: 'pQ4lUeiTkKXqKl58VOJP_7IrMCM',
});

// Enable file upload middleware
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

// Upload route
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.image;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'uploads',
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

export default router;
