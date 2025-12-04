// Types para el sistema de permisos y roles

export type Role = {
  id: number;
  name: string;
  slug: string;
};

export type Setting = {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
};

export type PermissionGroup = {
  setting_name: string;
  permissions: string[];
};

export type Permissions = {
  [settingSlug: string]: PermissionGroup;
};

export type UserData = {
  id: number;
  email: string;
  nombre: string;
  apellidos: string;
  rut: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  token_type: string;
  user: UserData;
  roles: Role[];
  settings: Setting[];
  permissions: Permissions;
};

// Tipos extendidos para el contexto
export type UserWithRoles = UserData & {
  roles: Role[];
  settings: Setting[];
  permissions: Permissions;
};
