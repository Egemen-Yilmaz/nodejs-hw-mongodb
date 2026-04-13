
import { loginUser, refreshUserSession } from "../services/auth.js";

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

export const logoutUserController = async (req, res, next) => {
    if (req.cookies.refreshToken) {
        await logoutUser(req.cookies.refreshToken);
    }

    // Refresh token'ı cookie'den silelim
    res.clearCookie('refreshToken');

    res.status(204).send();
};