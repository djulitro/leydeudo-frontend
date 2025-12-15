# API Directory Structure

Esta carpeta contiene todos los servicios de API organizados por entidad/recurso.

## Estructura

```
src/api/
├── index.ts          # Punto de entrada central que exporta todos los módulos
├── config.ts         # Configuración base de API (URL, headers, auth, etc)
├── user/             # Módulo de usuarios
│   ├── index.ts      # Exporta todas las funciones de user
│   ├── get.ts        # GET requests (getUsers, getUserById, etc)
│   ├── post.ts       # POST requests (createUser)
│   ├── put.ts        # PUT requests (updateUser)
│   └── delete.ts     # DELETE requests (deleteUser)
└── [entity]/         # Otros módulos (casos, clientes, documentos, etc)
    ├── index.ts
    ├── get.ts
    ├── post.ts
    ├── put.ts
    └── delete.ts
```

## Uso

### Importar desde el punto central
```tsx
import { getUsers, createUser, updateUser, deleteUser } from 'src/api';
```

### Importar desde módulo específico
```tsx
import { getUsers } from 'src/api/user';
```

### Ejemplos de uso

#### GET - Obtener usuarios
```tsx
import { getUsers } from 'src/api';

const users = await getUsers();
```

#### POST - Crear usuario
```tsx
import { createUser } from 'src/api';

const newUser = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
});
```

#### PUT - Actualizar usuario
```tsx
import { updateUser } from 'src/api';

const updated = await updateUser('user-id', {
  name: 'Jane Doe',
  status: 'active',
});
```

#### DELETE - Eliminar usuario
```tsx
import { deleteUser } from 'src/api';

await deleteUser('user-id');
```

## Configuración

### Variables de entorno
Crea un archivo `.env` en la raíz de `frontend/`:

```env
VITE_API_URL=http://localhost:8081/api
```

### Autenticación
Las funciones de API utilizan automáticamente el token de autenticación si existe en `localStorage.authToken`. Puedes modificar esto en `src/api/config.ts`.

## Manejo de errores

Todas las funciones lanzan errores si la petición falla:

```tsx
import { getUsers, ApiError } from 'src/api';

try {
  const users = await getUsers();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}:`, error.message, error.data);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Agregar nuevos módulos

1. Crear carpeta para la entidad: `src/api/[entity]/`
2. Crear archivos por método HTTP: `get.ts`, `post.ts`, `put.ts`, `delete.ts`
3. Crear `index.ts` en la carpeta para exportar funciones
4. Agregar export en `src/api/index.ts`:
   ```ts
   export * from './[entity]';
   ```

## Buenas prácticas

- Mantén un archivo por tipo de operación HTTP
- Usa TypeScript types para payloads y responses
- Centraliza configuración en `config.ts`
- Documenta cada función con JSDoc
- Maneja errores de forma consistente
- Usa `apiFetch` helper para requests comunes
