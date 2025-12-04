import type { ReactNode } from 'react';
import type { RoutePermissionConfig } from 'src/utils/permissions';

import { Navigate } from 'react-router-dom';

import { canAccessRoute } from 'src/utils/permissions';

// ----------------------------------------------------------------------

type PermissionRouteProps = {
  children: ReactNode;
  permissions?: RoutePermissionConfig;
};

export function PermissionRoute({ children, permissions }: PermissionRouteProps) {
  // Si no hay configuración de permisos, permitir acceso
  if (!permissions) {
    return <>{children}</>;
  }

  // Validar permisos
  const hasAccess = canAccessRoute(permissions);

  // Si no tiene acceso, redirigir a 404
  if (!hasAccess) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
}
