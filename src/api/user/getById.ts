import { apiClient } from 'src/utils/api-client';

/**
 * Get a single user by ID
 */
export async function getUserById<T = any>(userId: string | number): Promise<T> {
  return apiClient.get<T>(`/users/${userId}`);
}
