/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // App Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;

  // Development Server
  readonly VITE_PORT: string;
  readonly VITE_HOST: string;

  // Storage Configuration
  readonly VITE_STORAGE_PREFIX: string;

  // Environment
  readonly VITE_ENV: string;

  // Vite default
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

