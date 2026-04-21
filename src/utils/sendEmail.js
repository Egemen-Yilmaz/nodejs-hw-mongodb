import nodemailer from 'nodemailer';
import { env } from './env.js';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: env('SMTP_HOST'), // smtp-relay.brevo.com
    port: Number(env('SMTP_PORT')), // 587
    secure: false, // 587 için her zaman false olmalı
    auth: {
      user: env('SMTP_USER'),
      pass: env('SMTP_PASSWORD'),
    },
    // Bu kısım Render gibi bulut sunucularda bağlantı kopmalarını engeller:
    tls: {
      rejectUnauthorized: false 
    }
  });

  try {
    // Bağlantıyı göndermeden önce test et (Loglarda hatayı net görmek için)
    await transporter.verify();
    
    const result = await transporter.sendMail({
      from: env('SMTP_FROM'),
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    
    return result;
  } catch (error) {
    // Hatayı console'a yazdır ki Render Logs'ta tam olarak ne olduğunu görelim
    console.error("NODEMAILER DETAYLI HATA:", error);
    throw error;
  }
};