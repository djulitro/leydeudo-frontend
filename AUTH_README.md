# 🔐 Sistema de Autenticación JWT

Sistema completo de autenticación con JWT tokens implementado en el proyecto.

## 📋 Archivos Importantes

- **`src/contexts/auth-context.tsx`** - Context de autenticación con gestión de tokens
- **`src/utils/axios.ts`** - Utilidades para peticiones HTTP con JWT
- **`src/routes/components/protected-route.tsx`** - Componente para proteger rutas
- **`src/sections/auth/sign-in-view.tsx`** - Vista de login

## 🚀 Modo de Prueba (Actual)

Actualmente está en **modo mock** para probar sin backend.

### Credenciales de prueba:
```
Email: cualquier email válido
Password: mínimo 6 caracteres
```

### Lo que hace:
1. Genera un token JWT simulado con formato real: `header.payload.signature`
2. Guarda el token en `localStorage` como `auth_token`
3. Guarda el usuario en `localStorage` como `auth_user`
4. El token se incluye automáticamente en peticiones HTTP

### Verificar en consola:
Abre DevTools → Console después de hacer login y verás:
```
✅ Login exitoso
📧 Usuario: demo@test.com
🔑 Token JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔌 Conectar con Backend Real

### 1. Actualizar el login en `auth-context.tsx`

Reemplaza el código mock (líneas 80-120) con:

```typescript
const login = useCallback(async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    
    // Tu backend debe devolver algo como:
    // {
    //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    //   user: {
    //     id: "123",
    //     email: "user@example.com",
    //     name: "User Name",
    //     avatar: "url_optional"
    //   }
    // }
    
    const { token, user } = data;

    setUser(user);
    setToken(token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    console.log('✅ Login exitoso');
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
}, []);
```

### 2. Formato esperado del backend

Tu API debe devolver este formato:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDA4NjQwMH0.signature",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### 3. Usar `authFetch` para peticiones protegidas

En cualquier archivo donde necesites hacer peticiones autenticadas:

```typescript
import { authFetch } from 'src/utils/axios';

// GET request
const getUsers = async () => {
  const response = await authFetch('http://localhost:3000/api/users');
  const users = await response.json();
  return users;
};

// POST request
const createProduct = async (product: any) => {
  const response = await authFetch('http://localhost:3000/api/products', {
    method: 'POST',
    body: JSON.stringify(product)
  });
  return response.json();
};

// PUT request
const updateUser = async (id: string, data: any) => {
  const response = await authFetch(`http://localhost:3000/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.json();
};
```

El header `Authorization: Bearer {token}` se incluye automáticamente.

## 🔒 Protección de Rutas

Las rutas protegidas están en `src/routes/sections.tsx`:

```typescript
{
  element: (
    <ProtectedRoute>
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <DashboardPage /> },
    { path: 'user', element: <UserPage /> },
    { path: 'products', element: <ProductsPage /> },
    { path: 'blog', element: <BlogPage /> },
  ],
}
```

Todas las rutas dentro de `<ProtectedRoute>` requieren autenticación.

## 🛠️ Características Implementadas

✅ Login con validación de credenciales  
✅ Token JWT en formato estándar  
✅ Persistencia de sesión con localStorage  
✅ Protección automática de rutas privadas  
✅ Redirección a `/sign-in` si no está autenticado  
✅ Logout con limpieza de sesión  
✅ Manejo automático de tokens en peticiones HTTP  
✅ Manejo de errores 401 (token expirado)  
✅ Loading states en toda la aplicación  
✅ Información del usuario en el header  

## 🧪 Probar el Sistema

1. **Abre la aplicación**
   ```bash
   npm run dev
   ```

2. **Intenta acceder a `/` o `/user` sin login** → Te redirige a `/sign-in`

3. **Haz login con cualquier email y contraseña (mín 6 chars)**

4. **Abre DevTools → Application → Local Storage**
   - Verás `auth_token` con el JWT
   - Verás `auth_user` con los datos del usuario

5. **Navega por las rutas protegidas** → Todo funciona

6. **Haz logout** → Se limpian los datos y vuelves al login

7. **Recarga la página** → La sesión persiste (mientras el token sea válido)

## 🔧 Variables de Entorno (Opcional)

Puedes crear un archivo `.env` para configurar la URL del backend:

```env
VITE_API_URL=http://localhost:3000/api
```

Y usarlo así:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  // ...
});
```

## 📝 Notas Importantes

- El token mock tiene una estructura JWT válida pero no está firmado realmente
- Cuando conectes con tu backend, asegúrate de que devuelva el formato esperado
- El sistema maneja automáticamente tokens expirados (status 401)
- Puedes acceder al token desde cualquier componente con `useAuthContext()`

```typescript
import { useAuthContext } from 'src/contexts/auth-context';

function MyComponent() {
  const { user, token, authenticated } = useAuthContext();
  
  console.log('Token:', token);
  console.log('Usuario:', user);
  console.log('Autenticado:', authenticated);
  
  return <div>Hello {user?.name}</div>;
}
```
