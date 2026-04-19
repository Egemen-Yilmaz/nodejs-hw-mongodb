
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserController, loginUserController, refreshUserSessionController, logoutUserController, sendResetEmailController, resetPasswordController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema } from '../validation/auth.js'; // Bu şemaları oluşturman gerekecek

const router = Router();

router.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(sendResetEmailController),);
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default router;