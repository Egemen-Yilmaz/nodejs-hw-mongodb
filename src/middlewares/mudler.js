

import multer from 'multer';
import path from 'node:path';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024}, // Maks 5MB
});