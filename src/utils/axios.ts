import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

// Utilidad para manejar peticiones HTTP con JWT

const STORAGE_KEY_TOKEN = `${CONFIG.storagePrefix}auth_token`;

/**
 * Obtiene el token JWT del localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Crea headers con el token JWT incluido
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Wrapper de fetch con autenticación automática
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Si el token expiró o es inválido (401), limpiar la sesión
  if (response.status === 401) {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem('auth_user');
    window.location.href = '/sign-in';
  }

  return response;
};

/**
 * Ejemplo de uso con tu API:
 *
 * import { CONFIG } from 'src/config-global';
 *
 * // GET request
 * const response = await authFetch(`${CONFIG.apiBaseUrl}/users`);
 * const users = await response.json();
 *
 * // POST request
 * const response = await authFetch(`${CONFIG.apiBaseUrl}/products`, {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'Product 1', price: 100 })
 * });
 *
 * // PUT request
 * const response = await authFetch(`${CONFIG.apiBaseUrl}/users/1`, {
 *   method: 'PUT',
 *   body: JSON.stringify({ name: 'Updated Name' })
 * });
 * 
 * // Recomendado: Usar apiClient en su lugar
 * import { apiClient } from 'src/utils/api-client';
 * const users = await apiClient.get('/users');
 */
