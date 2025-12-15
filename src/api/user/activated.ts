import { apiClient } from 'src/utils/api-client';

/**
 * Activated user by id
 * @returns Promise with array of users
 */
export async function activated<T = any>(userId: number): Promise<T[]> {
  return apiClient.put<T[]>(`/users/${userId}/activate`);
}
