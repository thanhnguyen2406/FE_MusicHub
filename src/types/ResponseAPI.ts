export type ResponseAPI<T = any> = {
  code: number;
  message: string;
  token?: string;
  expiration?: string; // ISO string or Date
  data: T;
}; 