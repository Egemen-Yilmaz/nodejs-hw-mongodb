

import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { env } from './env.js';

cloudinary.v2.config({
    cloud_name: env('CLOUDINARY_CLOUD_NAME'),
    api_key: env('CLOUDINARY_API_KEY'),
    api_secret: env('CLOUDINARY_API_SECRET'),
});

export const saveFileToCloudinary = async (file) => {
    const response = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'contacts', // Resimler 'contacts' klasöründe toplansın
    });

    // Buluta yükledikten sonra yerel temp dosyasını siliyoruz
    await fs.unlink(file.path);

    return response.secure_url; // Resim linkini döner
};