import nodemailer from 'nodemailer';
import { env } from './env.js';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port: Number(env('SMTP_PORT')),
    auth: {
      user: env('SMTP_USER'),
      pass: env('SMTP_PASSWORD'), // .env'de güncelleyeceğimiz şifre
    },
    tls: {
    rejectUnauthorized: false // Sertifika hatalarını görmezden gelmek için
  }
  });

  const mailOptions = {
    from: env('SMTP_FROM'),
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("NODEMAILER HATASI:", error.message);
    throw error;
  }
};