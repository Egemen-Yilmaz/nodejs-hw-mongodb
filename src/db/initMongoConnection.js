import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const pwd = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    // DEĞİŞKEN BURADA TANIMLANIYOR:
    const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

    // Tanımladığımız ismi burada kullanıyoruz:
    await mongoose.connect(connectionString);
    
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('MongoDB bağlantısı başarısız:', e);
    throw e;
  }
};