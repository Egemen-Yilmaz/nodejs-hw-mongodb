

const parseType = (type) => {
    const isString = typeof type === 'string';

    if (!isString) return undefined;

    const isAllowedType = ['work', 'home', 'personal'].includes(type);

    if (!isAllowedType) return type;

    return type;
};

const parseBoolean = (value) => {
    if ( typeof value !== 'string') return undefined;
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    return undefined;
};

export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;

    return {
        contactType: parseType(contactType),
        isFavourite: parseBoolean(isFavourite),
    };
};