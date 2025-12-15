// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  apiBaseUrl: string;
  apiTimeout: number;
  storagePrefix: string;
  env: string;
};

export const CONFIG: ConfigValue = {
  appName: import.meta.env.VITE_APP_NAME || 'LeyDeudo',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  storagePrefix: import.meta.env.VITE_STORAGE_PREFIX || 'leydeudo_',
  env: import.meta.env.VITE_ENV || import.meta.env.MODE || 'development',
};
