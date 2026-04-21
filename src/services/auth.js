
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendEmail.js';

const ACCESS_TOKEN_VALID_UNTIL = 15 * 60 * 1000; // 15 dakika
const REFRESH_TOKEN_VALID_UNTIL = 30 * 24 * 60 * 60 * 1000; // 30 gün

export const loginUser = async (email, password) => {
    // eposta kayıtlı mı?
    const user = await UserCollection.findOne({ email });
    if (!user) throw createHttpError(401, 'User not found!');

    // şifre doğru mu?
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) throw createHttpError(401, 'Unauthorized!');

    // Varsa eski oturumu silme
    await SessionCollection.deleteOne({ userId: user._id });

    // Yeni tokenler üretme
    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');

    // Oturumu veritabanına kaydetme
    return await SessionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_VALID_UNTIL),
        refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_VALID_UNTIL),
    });
};

export const registerUser = async (payload) => {
    // eposta kullanımda mı?
    const user = await UserCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email is already in use!');

    // şifreyi hashle
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    return await UserCollection.create({
        ...payload,
        password: hashedPassword,
    });
};

export const refreshUserSession = async ({ refreshToken }) => {
    // 1. Veritabanında bu refresh token'a sahip bir oturum var mı?
    const session = await SessionCollection.findOne({ refreshToken });
    if (!session) throw createHttpError(401, 'Session not found!');

    // 2. Refresh token geçerli mi?
    if (new Date() > new Date(session.refreshTokenValidUntil)) {
        throw createHttpError(401, 'Refresh token expired!');
    }

    // 3. Eski oturumu silelim
    await SessionCollection.deleteOne({ _id: session._id });

    // 4. Yeni tokenler üretelim
    const newAccessToken = crypto.randomBytes(30).toString('base64');
    const newRefreshToken = crypto.randomBytes(30).toString('base64');

    return await SessionCollection.create({
        userId: session.userId,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_VALID_UNTIL),
        refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_VALID_UNTIL),
    });
};


export const logoutUser = async (refreshToken) => {
    await SessionCollection.deleteOne({ refreshToken });
};

export const requestResetToken = async (email) => {
    const user = await UserCollection.findOne({ email });

    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    // 5 dakika geçerli token oluşturuyoruz
    const resetToken = jwt.sign(
        { email },
        env('JWT_SECRET'),
        { expiresIn: '5m' }
    );

    const resetUrl = `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`;

    try {
        await sendEmail({
            to: email,
            subject: 'Reset your password',
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password!</p>`,
        });
    } catch (error) {
        console.log("NODEMAILER DETAYLI HATA:", error);

        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};

export const resetPassword = async (payload) => {
    let entries;

    // 1. Token'ı doğrulama
    try {
        entries = jwt.verify(payload.token, env('JWT_SECRET'));
    } catch (err) {
        throw createHttpError(401, 'Token is expired or invalid');
    }

    // 2. Kullanıcıyı bulmak için
    const  user = await UserCollection.findOne({ email: entries.email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    // 3. Şifreyi hashle ve güncelle
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    await UserCollection.updateOne(
        { _id: user._id },
        { password: hashedPassword },
    );

    // 4. Kullanıcının TÜM oturumlarını silme (Güvenlik için önemli!)
    await SessionCollection.deleteMany({ userId: user._id });
}