import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { getContactsController, getContactByIdController, createContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

const router = Router();
// TÜM kontak rotalarından önce authenticate middleware'ini kullanıyoruz
router.use(authenticate); 

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/contacts/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;