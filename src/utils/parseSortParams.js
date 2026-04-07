

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  // Sadece izin verdiğimiz alanlarda sıralama yapılsın
  const allowedKeys = ['name', 'createdAt', 'updatedAt'];
  const parsedSortBy = allowedKeys.includes(sortBy) ? sortBy : 'name';

  // Sıralama yönü sadece 'asc' veya 'desc' olabilir
  const parsedSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};