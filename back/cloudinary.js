import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // To load environment variables

const app = express();
const port = 5000;

// Cloudinary config using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

app.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                res.status(200).json({
                    message: 'Image uploaded successfully',
                    imageUrl: result.secure_url, // URL of the uploaded image
                });
            }
        );

        result.end(file.buffer); // Send the image buffer to Cloudinary
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
