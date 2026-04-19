import axios from 'axios';
import { env } from './env.js';

export const sendEmail = async (options) => {
  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: "Egemen App", email: env('SMTP_FROM') },
      to: [{ email: options.to }],
      subject: options.subject,
      htmlContent: options.html
    }, {
      headers: {
        'api-key': env('BREVO_API_KEY'), // .env'deki xkeysib ile başlayan anahtar
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("BREVO API HATASI:", error.response?.data || error.message);
    throw error;
  }
};