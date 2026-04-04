import createError from 'http-errors';
import { getAllContacts, 
  getContactById, 
  createContact, 
  updateContact, 
  deleteContact 
} from '../services/contact.js';


// Tüm rehberi getiren kontrolör
export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// ID ile tekil getiren kontrolör
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, `Contact with id ${contactId} not found!`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// Yeni bir rehber oluşturan kontrolör
export const createContactController = async (req, res) => {
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: 'Contact created a contact!',
        data: contact,
    });
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result.contact) {
        throw createError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result.contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
};