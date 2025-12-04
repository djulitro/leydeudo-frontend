import type { RoutePermissionConfig } from 'src/utils/permissions';

import {
  hasRole,
  hasAnyRole,
  hasSetting,
  hasAllRoles,
  isSuperAdmin,
  hasAnySetting,
  hasPermission,
  hasAllSettings,
  canAccessRoute,
  hasAnyPermission,
  hasAllPermissions,
} from 'src/utils/permissions';

import { useAuthContext } from 'src/contexts/auth-context';

// ----------------------------------------------------------------------

/**
 * Hook para acceder a las funciones de permisos
 * Se actualiza automáticamente cuando cambia el contexto de autenticación
 */
export function usePermissions() {
  const { user, roles, settings, permissions } = useAuthContext();

  return {
    // Datos del usuario
    user,
    roles,
    settings,
    permissions,

    // Validaciones de roles
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSuperAdmin: isSuperAdmin(),

    // Validaciones de settings
    hasSetting,
    hasAnySetting,
    hasAllSettings,

    // Validaciones de permisos
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Validación combinada de rutas
    canAccessRoute,
  };
}

/**
 * Hook para verificar si el usuario puede realizar una acción específica
 */
export function useCanPerform(permission: string): boolean {
  const { hasPermission: checkPermission } = usePermissions();
  return checkPermission(permission);
}

/**
 * Hook para verificar si el usuario tiene un rol específico
 */
export function useHasRole(roleSlug: string): boolean {
  const { hasRole: checkRole } = usePermissions();
  return checkRole(roleSlug);
}

/**
 * Hook para verificar si el usuario puede acceder a una ruta
 */
export function useCanAccess(config: RoutePermissionConfig): boolean {
  const { canAccessRoute: checkAccess } = usePermissions();
  return checkAccess(config);
}
