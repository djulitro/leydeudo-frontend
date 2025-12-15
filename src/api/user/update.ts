import { apiClient } from 'src/utils/api-client';

export interface UpdateUserPayload {
  email?: string;
  nombre?: string;
  apellidos?: string;
  rut?: string;
  direccion?: string;
  telefono?: string;
  celular?: string;
  role_slug?: string;
}

/**
 * Update an existing user
 */
export async function updateUser(userId: string | number, body: UpdateUserPayload) {
  return apiClient.put(`/users/${userId}`, body);
}
