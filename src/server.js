import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandlers.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
    const app = express();

    // Middleware'ler
    app.use(express.json()); // JSON gövdelerini okumak için
    app.use(cors());
    app.use(
        pino({
        transport: { target: 'pino-pretty' },
        })
    );

    // Rotalar
    app.use(contactsRouter);


    // Middleware'ler (Sıralama önemli: Not Found Handler en sona eklenmeli)
    app.use(notFoundHandler);
    app.use(errorHandler);

    
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}