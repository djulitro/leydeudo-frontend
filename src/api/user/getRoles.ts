import { apiClient } from 'src/utils/api-client';

/**
 * Get all users
 * @returns Promise with array of users
 */
export async function getRoles<T = any>(): Promise<T[]> {
  return apiClient.get<T[]>('/roles');
}
