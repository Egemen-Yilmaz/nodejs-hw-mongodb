
import { loginUser, refreshUserSession, registerUser, logoutUser, requestResetToken, resetPassword } from "../services/auth.js";

// 1. Kayıt Kontrolörü
export const registerUserController = async (req, res, next) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'User registered successfully!',
        data: user,
    });
};

// 2. Giriş Kontrolörü
export const loginUserController = async (req, res, next) => {
    const session = await loginUser(req.body.email, req.body.password);

    // Refresh token'ı cookie'ye ekleyelim
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true, // JavaScript tarafından erişilemez
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
    });

    res.status(200).json({
        status: 200,
        message: 'User logged in successfully!',
        data: {
            accessToken: session.accessToken,
        },
    });
};

// 3. Oturum Yenileme Kontrolörü
export const refreshUserSessionController = async (req, res, next) => {
    const session = await refreshUserSession({
        refreshToken: req.cookies.refreshToken,
    });

    // Yeni refresh token'ı cookie'ye ekleyelim
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true, // JavaScript tarafından erişilemez 
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
    });

    res.json({
        status: 200,
        message: 'Session refreshed successfully!',
        data: {
            accessToken: session.accessToken,
        },
    });
};

// 4. Çıkış Kontrolörü
export const logoutUserController = async (req, res, next) => {
    if (req.cookies.refreshToken) {
        await logoutUser(req.cookies.refreshToken);
    }

    // Refresh token'ı cookie'den silelim
    res.clearCookie('refreshToken');

    res.status(204).send();
};

export const sendResetEmailController = async (req, res, next) => {
    await requestResetToken(req.body.email);

    res.status(200).json({
        status: 200,
        message: 'Reset password email has been successfully sent.',
        data: {},
    });
};


export const resetPasswordController = async (req,res) => {
    // Body'den token ve yeni password gelecek
    await resetPassword(req.body);

    res.status(200).json({
        status: 200,
        message: 'Password has been seccssesfully reset.',
        data: {},
    });
};

