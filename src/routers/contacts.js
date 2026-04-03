import { Router } from "express";
import { getContactsController, getContactByIdController, createContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController)); // POST rotasını ekledim

router.patch('/contacts/:contactId', ctrlWrapper(patchContactController)); // PATCH rotasını ekledim

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController)); // DELETE rotasını ekledim

export default router;