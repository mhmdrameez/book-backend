interface PaginationOptions {
  page: number;
  limit: number;
}

export const getPagination = (
  page: number,
  limit: number
): PaginationOptions => {
  return {
    page: page <= 0 ? 1 : page,
    limit: limit <= 0 ? 10 : limit,
  };
};

export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};
