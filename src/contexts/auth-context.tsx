import type { ReactNode } from 'react';
import type { Role, Setting, UserData, Permissions } from 'src/types/auth.types';

import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import {
  getUserRoles,
  getUserSettings,
  getUserPermissions,
  saveUserAuthorization,
  clearUserAuthorization,
} from 'src/utils/permissions';

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

const STORAGE_KEY_USER = 'auth_user';
const STORAGE_KEY_TOKEN = 'auth_token';

// Simulación de JWT token
const generateMockJWT = (email: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      email,
      sub: '1',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 * 24, // 24 horas
    })
  );
  const signature = btoa('mock_signature_' + email);
  return `${header}.${payload}.${signature}`;
};

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
      // TODO: Reemplazar con llamada real a tu API
      // const response = await fetch('http://localhost:3000/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      //
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Error al iniciar sesión');
      // }
      //
      // const data = await response.json();
      // const { token, user } = data;

      // Simulación de API con delay realista
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Validación básica
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Generar token JWT simulado
      const mockToken = generateMockJWT(email);

      // Datos mock basados en la respuesta real del backend
      const mockRoles: Role[] = [
        {
          id: 1,
          name: 'Super Administrador',
          slug: 'super_admin',
        },
      ];

      const mockSettings: Setting[] = [
        {
          id: 1,
          name: 'Gestión de Usuarios',
          slug: 'user.mantenedor',
          description: 'Configuraciones relacionadas con el mantenedor de usuarios',
          active: true,
        },
      ];

      const mockPermissions: Permissions = {
        'user.mantenedor': {
          setting_name: 'Gestión de Usuarios',
          permissions: ['users.view', 'users.create', 'users.edit', 'users.delete'],
        },
      };

      // Usuario simulado (esto vendría del backend)
      const mockUser: User = {
        id: 1,
        email,
        nombre: email.split('@')[0],
        apellidos: 'Demo',
        rut: '123456789',
      };

      // Guardar en estado y localStorage
      setUser(mockUser);
      setToken(mockToken);
      setRoles(mockRoles);
      setSettings(mockSettings);
      setPermissions(mockPermissions);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, mockToken);
      saveUserAuthorization(mockRoles, mockSettings, mockPermissions);

      console.log('✅ Login exitoso');
      console.log('📧 Usuario:', mockUser.email);
      console.log('👤 Nombre:', `${mockUser.nombre} ${mockUser.apellidos}`);
      console.log('🔑 Token JWT:', mockToken);
      console.log('🎭 Roles:', mockRoles);
      console.log('⚙️ Settings:', mockSettings);
      console.log('🔐 Permissions:', mockPermissions);
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
