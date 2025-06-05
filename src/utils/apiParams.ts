export interface PaginationParams {
  page?: number;
  size?: number;
}

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 0;

export const getPaginationParams = (params?: PaginationParams) => ({
  page: params?.page ?? DEFAULT_PAGE,
  size: params?.size ?? DEFAULT_PAGE_SIZE,
});

export const getQueryParams = (params: Record<string, any>) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }), {});
}; 