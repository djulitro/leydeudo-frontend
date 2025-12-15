import { apiClient } from 'src/utils/api-client';

/**
 * Create user payload
 */
export interface CreateUserPayload {
  email: string;
  password?: string;
  nombre: string;
  apellidos: string;
  rut: string;
  direccion?: string;
  telefono?: string;
  celular?: string;
  role_slug: string;
}

/**
 * Create a new user
 * @param body - User data to create
 * @returns Promise with the API response
 */
export async function createUser(body: CreateUserPayload) {
  return apiClient.post('/users', body);
}
