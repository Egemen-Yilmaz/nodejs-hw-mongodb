import { Router } from "express";
import { getContactsController, getContactByIdController, createContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController)); // POST rotasını ekledim

router.patch('/contacts/:contactId', validateBody(updateContactSchema), ctrlWrapper(patchContactController)); // PATCH rotasını ekledim

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController)); // DELETE rotasını ekledim

export default router;