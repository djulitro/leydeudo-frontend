import { apiClient } from 'src/utils/api-client';

/**
 * Disable user by id
 * @returns Promise with array of users
 */
export async function disable<T = any>(userId: number): Promise<T[]> {
  return apiClient.put<T[]>(`/users/${userId}/disable`);
}
