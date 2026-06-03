export const API_BASE_URL = 'https://fakestoreapi.com';

export const API_ENDPOINTS = {
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  ALL_PRODUCTS: '/products',
} as const;