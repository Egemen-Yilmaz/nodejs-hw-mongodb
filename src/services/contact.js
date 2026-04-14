import { Contact } from '../db/contacts.js';

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    userId,
    sortBy = 'name',
    sortOrder = 'asc',
    filter = {}
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = Contact.find({ userId }); // Sadece kullanıcının kendi rehberini çekiyoruz

    // Filtreleme
    if (filter.contactType) contactsQuery.where('contactType').equals(filter.contactType);
    if (filter.isFavourite !== undefined) contactsQuery.where('isFavourite').equals(filter.isFavourite);

    // Toplam öğe sayısınıı ve veriyi paralel çekiyoruz (Performans için)
    const [totalItems, data] = await Promise.all([
        Contact.countDocuments({ userId, ...filter}), // Toplam öğe sayısı
        contactsQuery
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder }) // Sıralama
            .exec(), // Sorguyu çalıştır
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
};

export const getContactById = async (contactId, userId) => {
    // Sadece ID yetmez, sahibi de kontrol edilmeli!
    const contact = await Contact.findOne({ _id: contactId, userId });
    return contact;
};

export const createContact = async (payload) => {
    const newContact = await Contact.create(payload);
    return newContact;
};

export const updateContact = async (contactId, userId, payload, options = {}) => {
    const rawResult = await Contact.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        { 
            new: true, // Güncellenmiş veriyi dön
            includeResultMetadata: true, // Raw sonucu dahil et
            ...options,
        },
    );

    if (!rawResult || !rawResult.value) return null; // Kayıt bulunamazsa null döner

    return {
        contact: rawResult.value, // Güncellenmiş contact
        isNew: Boolean(rawResult.lastErrorObject.upserted), // true ise yeni bir kayıt oluşturulmuş, false ise güncelleme yapılmış
    }
};


export const deleteContact = async (contactId, userId) => {
    const contact = await Contact.findOneAndDelete({
        _id: contactId,
        userId, // Sadece sahibi silebilir
    });

    return contact;
};