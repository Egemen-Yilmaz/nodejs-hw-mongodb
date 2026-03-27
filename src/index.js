import 'dotenv/config'; // .env dosyasındaki değişkenleri process.env içine yükler
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
    try {
        // 1. Önce veritabanı bağlantısı kurulur
        await initMongoConnection();

        // 2. Veritabanı bağlantısı başarılı olduktan sonra sunucu başlatılır
        setupServer();
    } catch (e) {
        console.error('Bootstrap error', e);
    }
};

bootstrap();