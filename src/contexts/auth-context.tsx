import type { ReactNode } from 'react';
import type { Role, Setting, UserData, Permissions } from 'src/types/auth.types';

import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import { apiClient } from 'src/utils/api-client';
import {
  getUserRoles,
  getUserSettings,
  getUserPermissions,
  saveUserAuthorization,
  clearUserAuthorization,
} from 'src/utils/permissions';

import { CONFIG } from 'src/config-global';


// ----------------------------------------------------------------------

export type User = UserData;

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  token: string | null;
  roles: Role[];
  settings: Setting[];
  permissions: Permissions;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY_USER = `${CONFIG.storagePrefix}auth_user`;
const STORAGE_KEY_TOKEN = `${CONFIG.storagePrefix}auth_token`;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [loading, setLoading] = useState(true);

  // Inicializar estado desde localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setRoles(getUserRoles());
          setSettings(getUserSettings());
          setPermissions(getUserPermissions());
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        clearUserAuthorization();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login (aquí puedes integrar tu API)
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response: any = await apiClient.post('/login', { email, password });

      setUser(response.user);
      setToken(response.token);
      setRoles(response.roles);
      setSettings(response.settings);
      setPermissions(response.permissions);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(response.user));
      localStorage.setItem(STORAGE_KEY_TOKEN, response.token);
      saveUserAuthorization(response.roles, response.settings, response.permissions);
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRoles([]);
    setSettings([]);
    setPermissions({});
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    clearUserAuthorization();
    console.log('👋 Logout exitoso');
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user,
      token,
      roles,
      settings,
      permissions,
      loading,
      authenticated: !!user && !!token,
      login,
      logout,
    }),
    [user, token, roles, settings, permissions, loading, login, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

// ----------------------------------------------------------------------

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
