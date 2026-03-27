import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllContacts, getContactById } from './services/contact.js';

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

    // Buraya sonra rotalar gelecek (Adım 5 ve 6)
    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to the Contacts API' });
    });

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();

        res.status(200).json({
            status: 200,
            message: 'Sucsessfully found contacts',
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        // Eğer contact bulunamazsa:
        if (!contact) {
            res.status(404).json({
                message: 'Contact not found',
            });
            return;
        }

        // Başarıyla bulunduysa:
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id: ${contactId}`,
            data: contact,
        });
    });

    // 404 Handler
    app.use((req, res) => {
        res.status(404).json({ 
            message: 'Not Found',
        });
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}