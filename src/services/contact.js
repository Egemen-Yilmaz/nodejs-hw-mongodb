import { Contact } from '../db/contacts.js';

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const newContact = await Contact.create(payload);
    return newContact;
};

export const updateContact = async (contactId, payload, options = {}) => {
    const rawResult = await Contact.findOneAndUpdate(
        { _id: contactId },
        payload,
        { 
            new: true, // Güncellenmiş veriyi dön
            includeResultMetadata: true, // Raw sonucu dahil et
            ...options,
        },
    );

    return {
        contact: rawResult.value, // Güncellenmiş contact
        isNew: Boolean(rawResult.lastErrorObject.upserted), // true ise yeni bir kayıt oluşturulmuş, false ise güncelleme yapılmış
    }
};


export const deleteContact = async (contactId) => {
    const contact = await Contact.findOneAndDelete({
        _id: contactId,
    });

    return contact;
};