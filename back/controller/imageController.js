import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({
          message: 'Image uploaded successfully',
          imageUrl: result.secure_url, // URL of the uploaded image
        });
      }
    );

    result.end(req.file.buffer); // Send the image buffer to Cloudinary
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong during image upload' });
  }
};
