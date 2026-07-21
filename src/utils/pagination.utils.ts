export const getPagination = ({
  totalCount,
  perPage,
  currentPage,
}: {
  totalCount: number;
  perPage: number;
  currentPage: number;
}) => {
  const totalPage = Math.ceil(totalCount / perPage);

  const nextPage =
    currentPage < totalPage ? currentPage + 1 : null;

  const prevPage =
    currentPage > 1 ? currentPage - 1 : null;

  return {
    totalCount,
    perPage,
    currentPage,
    totalPage,
    nextPage,
    prevPage,
  };
};