import type { NavItem } from 'src/layouts/nav-config-dashboard';

import { canAccessRoute } from 'src/utils/permissions';

// ----------------------------------------------------------------------

/**
 * Filtra los items de navegación basándose en los permisos del usuario
 * @param navItems - Array de items de navegación
 * @returns Array de items filtrados que el usuario puede ver
 */
export const filterNavItemsByPermissions = (navItems: NavItem[]): NavItem[] => navItems.filter((item) => {
    // Si no tiene configuración de permisos, mostrar por defecto
    if (!item.permissions) return true;

    // Validar si el usuario puede acceder
    const hasAccess = canAccessRoute(item.permissions);

    // Si tiene hijos (submenu), filtrarlos recursivamente
    if (item.children && item.children.length > 0) {
      const filteredChildren = filterNavItemsByPermissions(item.children);
      // Solo mostrar el item padre si tiene hijos accesibles
      return hasAccess && filteredChildren.length > 0;
    }

    return hasAccess;
  });

/**
 * Obtiene los items de navegación filtrados para el usuario actual
 * @param allNavItems - Todos los items de navegación
 * @returns Items que el usuario puede ver
 */
export const getVisibleNavItems = (allNavItems: NavItem[]): NavItem[] => filterNavItemsByPermissions(allNavItems);

/**
 * Verifica si un path específico es accesible para el usuario
 * @param path - Path de la ruta
 * @param navItems - Items de navegación
 * @returns boolean indicando si el usuario puede acceder
 */
export const canAccessPath = (path: string, navItems: NavItem[]): boolean => {
  const item = navItems.find((navItem) => navItem.path === path);

  if (!item) return false;
  if (!item.permissions) return true;

  return canAccessRoute(item.permissions);
};

/**
 * Hook personalizado para obtener items de navegación filtrados
 */
export const useFilteredNavItems = (navItems: NavItem[]): NavItem[] => getVisibleNavItems(navItems);
