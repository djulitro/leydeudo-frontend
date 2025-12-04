import type { Role, Setting, Permissions } from 'src/types/auth.types';

// ----------------------------------------------------------------------
// STORAGE KEYS
// ----------------------------------------------------------------------

const STORAGE_KEY_ROLES = 'auth_roles';
const STORAGE_KEY_SETTINGS = 'auth_settings';
const STORAGE_KEY_PERMISSIONS = 'auth_permissions';

// ----------------------------------------------------------------------
// GETTERS
// ----------------------------------------------------------------------

/**
 * Obtiene los roles del usuario desde localStorage
 */
export const getUserRoles = (): Role[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ROLES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
};

/**
 * Obtiene las configuraciones del usuario desde localStorage
 */
export const getUserSettings = (): Setting[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting user settings:', error);
    return [];
  }
};

/**
 * Obtiene los permisos del usuario desde localStorage
 */
export const getUserPermissions = (): Permissions => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PERMISSIONS);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return {};
  }
};

// ----------------------------------------------------------------------
// SETTERS
// ----------------------------------------------------------------------

/**
 * Guarda los roles, settings y permisos en localStorage
 */
export const saveUserAuthorization = (
  roles: Role[],
  settings: Setting[],
  permissions: Permissions
): void => {
  try {
    localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(roles));
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEY_PERMISSIONS, JSON.stringify(permissions));
  } catch (error) {
    console.error('Error saving user authorization:', error);
  }
};

/**
 * Limpia toda la información de autorización
 */
export const clearUserAuthorization = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_ROLES);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_PERMISSIONS);
  } catch (error) {
    console.error('Error clearing user authorization:', error);
  }
};

// ----------------------------------------------------------------------
// VALIDACIONES DE ROLES
// ----------------------------------------------------------------------

/**
 * Verifica si el usuario tiene un rol específico por slug
 */
export const hasRole = (roleSlug: string): boolean => {
  const roles = getUserRoles();
  return roles.some((role) => role.slug === roleSlug);
};

/**
 * Verifica si el usuario tiene al menos uno de los roles especificados
 */
export const hasAnyRole = (roleSlugs: string[]): boolean => {
  const roles = getUserRoles();
  const userRoleSlugs = roles.map((role) => role.slug);
  return roleSlugs.some((slug) => userRoleSlugs.includes(slug));
};

/**
 * Verifica si el usuario tiene todos los roles especificados
 */
export const hasAllRoles = (roleSlugs: string[]): boolean => {
  const roles = getUserRoles();
  const userRoleSlugs = roles.map((role) => role.slug);
  return roleSlugs.every((slug) => userRoleSlugs.includes(slug));
};

/**
 * Verifica si el usuario es Super Administrador
 */
export const isSuperAdmin = (): boolean => hasRole('super_admin');

// ----------------------------------------------------------------------
// VALIDACIONES DE SETTINGS (CONFIGURACIONES)
// ----------------------------------------------------------------------

/**
 * Verifica si el usuario tiene acceso a una configuración específica por slug
 */
export const hasSetting = (settingSlug: string): boolean => {
  const settings = getUserSettings();
  return settings.some((setting) => setting.slug === settingSlug && setting.active);
};

/**
 * Verifica si el usuario tiene acceso a al menos una de las configuraciones
 */
export const hasAnySetting = (settingSlugs: string[]): boolean => settingSlugs.some((slug) => hasSetting(slug));

/**
 * Verifica si el usuario tiene acceso a todas las configuraciones
 */
export const hasAllSettings = (settingSlugs: string[]): boolean => settingSlugs.every((slug) => hasSetting(slug));

// ----------------------------------------------------------------------
// VALIDACIONES DE PERMISOS
// ----------------------------------------------------------------------

/**
 * Verifica si el usuario tiene un permiso específico
 */
export const hasPermission = (permission: string): boolean => {
  // NO hacer bypass de super admin - los permisos deben validarse siempre
  const permissions = getUserPermissions();

  // Buscar en todos los settings
  for (const settingPerms of Object.values(permissions)) {
    if (settingPerms.permissions.includes(permission)) {
      return true;
    }
  }

  return false;
};

/**
 * Verifica si el usuario tiene al menos uno de los permisos especificados
 */
export const hasAnyPermission = (permissionList: string[]): boolean => permissionList.some((permission) => hasPermission(permission));

/**
 * Verifica si el usuario tiene todos los permisos especificados
 */
export const hasAllPermissions = (permissionList: string[]): boolean => permissionList.every((permission) => hasPermission(permission));

/**
 * Obtiene todos los permisos de un setting específico
 */
export const getSettingPermissions = (settingSlug: string): string[] => {
  const permissions = getUserPermissions();
  return permissions[settingSlug]?.permissions || [];
};

// ----------------------------------------------------------------------
// VALIDACIONES COMBINADAS (PARA RUTAS)
// ----------------------------------------------------------------------

export type RoutePermissionConfig = {
  // Requerimientos de roles
  requireRole?: string;
  requireAnyRole?: string[];
  requireAllRoles?: string[];

  // Requerimientos de settings
  requireSetting?: string;
  requireAnySetting?: string[];
  requireAllSettings?: string[];

  // Requerimientos de permisos
  requirePermission?: string;
  requireAnyPermission?: string[];
  requireAllPermissions?: string[];

  // Público (accesible sin autenticación)
  isPublic?: boolean;
};

/**
 * Valida si el usuario puede acceder a una ruta basado en la configuración
 */
export const canAccessRoute = (config: RoutePermissionConfig): boolean => {
  // Si es ruta pública, siempre permitir
  if (config.isPublic) return true;

  // Validar settings SIEMPRE (incluso para super admin)
  // Si requiere un setting específico, el usuario DEBE tenerlo
  if (config.requireSetting && !hasSetting(config.requireSetting)) return false;
  if (config.requireAnySetting && !hasAnySetting(config.requireAnySetting)) return false;
  if (config.requireAllSettings && !hasAllSettings(config.requireAllSettings)) return false;

  // Validar permisos SIEMPRE (incluso para super admin)
  // Si requiere un permiso específico, el usuario DEBE tenerlo
  if (config.requirePermission && !hasPermission(config.requirePermission)) return false;
  if (config.requireAnyPermission && !hasAnyPermission(config.requireAnyPermission)) return false;
  if (config.requireAllPermissions && !hasAllPermissions(config.requireAllPermissions)) return false;

  // Super admin solo tiene bypass para validaciones de ROLES
  // Los settings y permisos siempre se validan
  const isSuperAdminUser = isSuperAdmin();
  
  // Validar roles (aquí sí aplica el bypass de super admin)
  if (config.requireRole && !hasRole(config.requireRole) && !isSuperAdminUser) return false;
  if (config.requireAnyRole && !hasAnyRole(config.requireAnyRole) && !isSuperAdminUser) return false;
  if (config.requireAllRoles && !hasAllRoles(config.requireAllRoles) && !isSuperAdminUser) return false;

  // Si pasó todas las validaciones, permitir acceso
  return true;
};

// ----------------------------------------------------------------------
// UTILIDADES DE DEBUG
// ----------------------------------------------------------------------

/**
 * Muestra en consola toda la información de autorización del usuario
 */
export const debugUserAuthorization = (): void => {
  console.group('🔐 User Authorization Debug');
  console.log('Roles:', getUserRoles());
  console.log('Settings:', getUserSettings());
  console.log('Permissions:', getUserPermissions());
  console.log('Is Super Admin:', isSuperAdmin());
  console.groupEnd();
};

/**
 * Prueba si el usuario puede acceder a una configuración específica
 */
export const testPermissionConfig = (config: RoutePermissionConfig, label?: string): void => {
  console.group(`🧪 Test: ${label || 'Configuración de permisos'}`);
  console.log('Config:', config);
  console.log('Resultado:', canAccessRoute(config) ? '✅ PERMITIDO' : '❌ DENEGADO');
  console.groupEnd();
};

// Exponer funciones globales para debugging en consola
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugUserAuthorization;
  (window as any).testPermission = testPermissionConfig;
}
