import createError from 'http-errors';
import { getAllContacts, 
  getContactById, 
  createContact, 
  updateContact, 
  deleteContact 
} from '../services/contact.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';


// Tüm rehberi getiren kontrolör
export const getContactsController = async (req, res) => {

    // 1. Query parametrelerini parse et (temizle ve varsayılan değerleri uygula)
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query); // Favori/Tür filtrelemesi için

    // 2. Servis katmanına temizlenmiş parametreleri gönder
    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user._id, // authenticate middleware'inden gelen kullanıcı ID'sini ekliyoruz
    });

    // 3. Yanıtı uygun formatta döndürür
    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts, // Servisten gelen paketlenmiş veri (data, page, perPage, totalItems, totalPages, hasPreviousPage, hasNextPage)
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
    const contact = await createContact({
        ...req.body,
        userId: req.user._id, // authenticate middleware'inden gelen kullanıcı ID'sini ekliyoruz
    });

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