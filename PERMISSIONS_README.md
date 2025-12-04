# 🔐 Sistema de Roles, Permisos y Configuraciones

Sistema completo para gestionar acceso basado en roles, settings y permisos individuales.

## 📁 Archivos del Sistema

```
src/
├── types/
│   └── auth.types.ts              # Tipos TypeScript para auth
├── utils/
│   ├── permissions.ts             # Validaciones de permisos
│   └── nav-filter.ts              # Filtrado de navegación
├── hooks/
│   └── use-permissions.ts         # Hooks React para permisos
├── contexts/
│   └── auth-context.tsx           # Context con roles y permisos
└── layouts/
    └── nav-config-dashboard-new.tsx  # Configuración del nav
```

## 🎯 Estructura de la Respuesta del Backend

```typescript
{
  "message": "Login exitoso",
  "token": "4|P48xsZSROrwwBbMC6jEcKrLIWjsApNbiDIa8I4qp18584b73",
  "token_type": "Bearer",
  "user": {
    "id": 2,
    "email": "user@example.com",
    "nombre": "Julio",
    "apellidos": "Segovia",
    "rut": "198187232"
  },
  "roles": [
    {
      "id": 1,
      "name": "Super Administrador",
      "slug": "super_admin"
    }
  ],
  "settings": [
    {
      "id": 1,
      "name": "Gestión de Usuarios",
      "slug": "user.mantenedor",
      "description": "Configuraciones relacionadas...",
      "active": true
    }
  ],
  "permissions": {
    "user.mantenedor": {
      "setting_name": "Gestión de Usuarios",
      "permissions": [
        "users.view",
        "users.create",
        "users.edit",
        "users.delete"
      ]
    }
  }
}
```

## 🔧 Cómo Funciona

### 1. **Roles** (`roles`)
Grupos de usuarios con privilegios específicos:
- `super_admin` → Acceso total a todo
- `admin` → Administrador normal
- `editor` → Puede editar contenido
- `viewer` → Solo lectura

### 2. **Settings** (`settings`)
Módulos o funcionalidades del sistema:
- `user.mantenedor` → Gestión de usuarios
- `products.mantenedor` → Gestión de productos
- `reports.view` → Acceso a reportes

**Importante:** Solo los settings con `active: true` están disponibles.

### 3. **Permissions** (`permissions`)
Acciones específicas dentro de cada setting:
- `users.view` → Ver usuarios
- `users.create` → Crear usuarios
- `users.edit` → Editar usuarios
- `users.delete` → Eliminar usuarios

## 📋 Uso en el Código

### Validar Roles

```typescript
import { hasRole, hasAnyRole, isSuperAdmin } from 'src/utils/permissions';

// ¿Tiene un rol específico?
if (hasRole('super_admin')) {
  console.log('Es super admin!');
}

// ¿Tiene al menos uno de estos roles?
if (hasAnyRole(['admin', 'super_admin'])) {
  console.log('Es administrador');
}

// ¿Es super admin? (acceso total)
if (isSuperAdmin()) {
  console.log('Acceso total');
}
```

### Validar Settings

```typescript
import { hasSetting, hasAnySetting } from 'src/utils/permissions';

// ¿Tiene acceso a este módulo?
if (hasSetting('user.mantenedor')) {
  console.log('Puede ver gestión de usuarios');
}

// ¿Tiene acceso a alguno de estos módulos?
if (hasAnySetting(['user.mantenedor', 'products.mantenedor'])) {
  console.log('Tiene acceso a algún mantenedor');
}
```

### Validar Permisos

```typescript
import { hasPermission, hasAllPermissions } from 'src/utils/permissions';

// ¿Puede realizar esta acción?
if (hasPermission('users.create')) {
  console.log('Puede crear usuarios');
}

// ¿Tiene todos estos permisos?
if (hasAllPermissions(['users.view', 'users.edit'])) {
  console.log('Puede ver y editar usuarios');
}
```

### Uso con Hooks (React)

```typescript
import { usePermissions, useCanPerform } from 'src/hooks/use-permissions';

function MyComponent() {
  const { isSuperAdmin, roles, permissions } = usePermissions();
  const canCreateUsers = useCanPerform('users.create');

  return (
    <div>
      {isSuperAdmin && <button>Admin Panel</button>}
      {canCreateUsers && <button>Crear Usuario</button>}
    </div>
  );
}
```

## 🗺️ Configurar Navegación con Permisos

### Archivo: `nav-config-dashboard-new.tsx`

```typescript
export const navConfig: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
    // Sin permisos = accesible para todos los autenticados
  },
  {
    title: 'Gestión de Usuarios',
    path: '/user',
    icon: icon('ic-user'),
    permissions: {
      requireSetting: 'user.mantenedor',
      requirePermission: 'users.view',
    },
  },
  {
    title: 'Products',
    path: '/products',
    icon: icon('ic-cart'),
    permissions: {
      requireAnySetting: ['products.mantenedor', 'inventory.view'],
    },
  },
  {
    title: 'Admin Panel',
    path: '/admin',
    icon: icon('ic-lock'),
    permissions: {
      requireRole: 'super_admin',
    },
  },
];
```

### Opciones de Configuración

```typescript
permissions: {
  // ROLES
  requireRole: 'super_admin',              // Requiere este rol exacto
  requireAnyRole: ['admin', 'editor'],     // Requiere al menos uno
  requireAllRoles: ['admin', 'verified'],  // Requiere todos

  // SETTINGS (Módulos)
  requireSetting: 'user.mantenedor',       // Requiere este setting
  requireAnySetting: ['user', 'products'], // Requiere al menos uno
  requireAllSettings: ['user', 'reports'], // Requiere todos

  // PERMISOS (Acciones)
  requirePermission: 'users.create',       // Requiere este permiso
  requireAnyPermission: ['view', 'edit'],  // Requiere al menos uno
  requireAllPermissions: ['view', 'edit'], // Requiere todos

  // PÚBLICO
  isPublic: true,                          // Accesible sin login
}
```

## 🎨 Ocultar Elementos en Componentes

### Botones Condicionales

```typescript
import { useCanPerform } from 'src/hooks/use-permissions';

function UserList() {
  const canCreate = useCanPerform('users.create');
  const canDelete = useCanPerform('users.delete');

  return (
    <div>
      <h1>Usuarios</h1>
      {canCreate && <button>Crear Nuevo Usuario</button>}
      
      <table>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              {canDelete && <button>Eliminar</button>}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
```

### Tabs Condicionales

```typescript
import { usePermissions } from 'src/hooks/use-permissions';

function Dashboard() {
  const { hasSetting } = usePermissions();

  return (
    <Tabs>
      <Tab label="Overview" />
      {hasSetting('user.mantenedor') && <Tab label="Usuarios" />}
      {hasSetting('products.mantenedor') && <Tab label="Productos" />}
      {hasSetting('reports.view') && <Tab label="Reportes" />}
    </Tabs>
  );
}
```

## 🔒 Proteger Rutas Completas

El sistema ya protege automáticamente las rutas del dashboard, pero puedes agregar validación adicional:

```typescript
// En cualquier página
import { useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { hasPermission } from 'src/utils/permissions';

function UserManagementPage() {
  const router = useRouter();

  useEffect(() => {
    if (!hasPermission('users.view')) {
      router.push('/403'); // Página de acceso denegado
    }
  }, [router]);

  return <div>Gestión de Usuarios</div>;
}
```

## 🧪 Testing en Modo Mock

El sistema está en modo mock. Datos actuales:

### Usuario Mock
```json
{
  "id": 1,
  "email": "test@example.com",
  "nombre": "Demo",
  "apellidos": "User",
  "rut": "123456789"
}
```

### Roles Mock
```json
[
  {
    "id": 1,
    "name": "Super Administrador",
    "slug": "super_admin"
  }
]
```

### Settings Mock
```json
[
  {
    "id": 1,
    "name": "Gestión de Usuarios",
    "slug": "user.mantenedor",
    "active": true
  }
]
```

### Permissions Mock
```json
{
  "user.mantenedor": {
    "setting_name": "Gestión de Usuarios",
    "permissions": [
      "users.view",
      "users.create",
      "users.edit",
      "users.delete"
    ]
  }
}
```

## 🔌 Conectar con Backend Real

### Actualizar `auth-context.tsx` (línea 90)

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
    const { token, user, roles, settings, permissions } = data;

    // Guardar todo en estado y localStorage
    setUser(user);
    setToken(token);
    setRoles(roles);
    setSettings(settings);
    setPermissions(permissions);

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    saveUserAuthorization(roles, settings, permissions);

    console.log('✅ Login exitoso');
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
}, []);
```

## 🐛 Debug y Testing

```typescript
import { debugUserAuthorization } from 'src/utils/permissions';

// Mostrar toda la información de permisos en consola
debugUserAuthorization();

// Output:
// 🔐 User Authorization Debug
//   Roles: [...]
//   Settings: [...]
//   Permissions: {...}
//   Is Super Admin: true
```

## 📊 Ventajas del Sistema

✅ **Flexible**: Combina roles, settings y permisos  
✅ **Granular**: Control fino de cada acción  
✅ **Escalable**: Fácil agregar nuevos módulos  
✅ **TypeScript**: Tipado completo  
✅ **React Hooks**: Integración natural con React  
✅ **Performance**: Cache en localStorage  
✅ **Super Admin**: Bypass automático de permisos  
✅ **Mock Ready**: Funciona sin backend  

## 🎯 Próximos Pasos

1. ✅ Sistema implementado y funcional
2. ⏳ Conectar con tu API backend
3. ⏳ Agregar más configuraciones de navegación
4. ⏳ Crear página 403 (Acceso Denegado)
5. ⏳ Implementar refresh token
6. ⏳ Agregar tests unitarios

## 💡 Ejemplos Prácticos

### Ejemplo 1: Editor de Usuarios

```typescript
function UserEditor({ userId }: { userId: number }) {
  const canEdit = useCanPerform('users.edit');
  const canDelete = useCanPerform('users.delete');
  const { isSuperAdmin } = usePermissions();

  return (
    <div>
      <h2>Editar Usuario</h2>
      
      {(canEdit || isSuperAdmin) ? (
        <form>
          <input name="name" />
          <button type="submit">Guardar</button>
        </form>
      ) : (
        <p>No tienes permisos para editar</p>
      )}
      
      {(canDelete || isSuperAdmin) && (
        <button color="error">Eliminar Usuario</button>
      )}
    </div>
  );
}
```

### Ejemplo 2: Dashboard Dinámico

```typescript
function DynamicDashboard() {
  const { settings } = usePermissions();

  return (
    <Grid container spacing={3}>
      {settings.map(setting => (
        setting.active && (
          <Grid item xs={12} md={6} key={setting.slug}>
            <Card>
              <CardHeader title={setting.name} />
              <CardContent>
                <p>{setting.description}</p>
                <Link to={`/${setting.slug}`}>
                  Ir a {setting.name}
                </Link>
              </CardContent>
            </Card>
          </Grid>
        )
      ))}
    </Grid>
  );
}
```
