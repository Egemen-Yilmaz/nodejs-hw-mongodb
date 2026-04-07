

import createError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, {
            abortEarly: false, // Tüm hataları aynı anda görmek için
        });
        next();
    } catch (err) {
        const error = createError(400, 'BadRequestError', {
            errors: err.details,
        });
        next(error);
    }
};