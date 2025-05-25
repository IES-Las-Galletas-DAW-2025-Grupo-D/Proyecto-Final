import { PaginatedResponse } from "../types/paginated";

export function getPaginationInfo<T>(page: PaginatedResponse<T>) {
  const currentPage = page.number + 1;
  const totalPages = page.totalPages;
  const hasPrevious = !page.first;
  const hasNext = !page.last;

  return {
    currentPage,
    totalPages,
    hasPrevious,
    hasNext,
    prevPageQuery: `?page=${currentPage - 2}`,
    nextPageQuery: `?page=${currentPage}`,
  };
}
