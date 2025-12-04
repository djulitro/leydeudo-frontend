import type { RoutePermissionConfig } from 'src/utils/permissions';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

// Tipo extendido para items del nav con permisos
export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
  permissions?: RoutePermissionConfig; // Configuración de permisos
  children?: NavItem[]; // Para submenus futuros
};

// ----------------------------------------------------------------------
// CONFIGURACIÓN DE NAVEGACIÓN CON PERMISOS
// ----------------------------------------------------------------------

export const navConfig: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
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
];

// ----------------------------------------------------------------------
// NAVEGACIÓN PÚBLICA (MOSTRAR SIEMPRE)
// ----------------------------------------------------------------------

export const publicNavItems: NavItem[] = [
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
    permissions: {
      isPublic: true,
    },
  },
];
