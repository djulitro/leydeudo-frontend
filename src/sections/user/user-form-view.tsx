import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { apiClient } from 'src/utils/api-client';
import { createUser, getRoles } from 'src/api';

// ----------------------------------------------------------------------

type UserFormData = {
  email: string;
  password?: string;
  nombre: string;
  apellidos: string;
  rut: string;
  direccion: string;
  telefono: string;
  celular: string;
  role_slug: string;
};

const initialFormData: UserFormData = {
  email: '',
  password: '',
  nombre: '',
  apellidos: '',
  rut: '',
  direccion: '',
  telefono: '',
  celular: '',
  role_slug: '',
};

// ----------------------------------------------------------------------

export function UserFormView() {
  const navigate = useNavigate();
  const router = useRouter();
  const { userId } = useParams<{ userId?: string }>();

  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resetTokenDialog, setResetTokenDialog] = useState<{
    open: boolean;
    token?: string;
    resetUrl?: string;
  }>({ open: false });

  const isEditMode = !!userId;

  // Cargar datos del usuario si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      loadUserData(userId);
    }
  }, [userId, isEditMode]);

  useEffect(() => {
    loadRoleData();
  }, []);

  const loadRoleData = useCallback(async () => {
    try {
      const response: any = await getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener los roles');
    }
  }, [])

  const loadUserData = useCallback(async (id: string) => {
    try {
      setLoading(true);
      // TODO: Reemplazar con llamada a API
      // const response = await apiClient.get(`/users/${id}`);
      // setFormData(response);
      
      // Mock data para desarrollo
      console.log('Loading user data for id:', id);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (field: keyof UserFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    // Email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Nombre
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 255) {
      newErrors.nombre = 'El nombre no puede exceder 255 caracteres';
    }

    // Apellidos
    if (!formData.apellidos) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    } else if (formData.apellidos.length > 255) {
      newErrors.apellidos = 'Los apellidos no pueden exceder 255 caracteres';
    }

    // RUT
    if (!formData.rut) {
      newErrors.rut = 'El RUT es requerido';
    }

    // Role
    if (!formData.role_slug) {
      newErrors.role_slug = 'El rol es requerido';
    }

    // Validaciones opcionales con límites
    if (formData.direccion && formData.direccion.length > 500) {
      newErrors.direccion = 'La dirección no puede exceder 500 caracteres';
    }

    if (formData.telefono && formData.telefono.length > 20) {
      newErrors.telefono = 'El teléfono no puede exceder 20 caracteres';
    }

    if (formData.celular && formData.celular.length > 20) {
      newErrors.celular = 'El celular no puede exceder 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        // Actualizar usuario
        const updateData = { ...formData };
        // No enviar password si está vacío en modo edición
        if (!updateData.password) {
          delete updateData.password;
        }
        await apiClient.put(`/users/${userId}`, updateData);
        console.log('User updated successfully');
        // Navegar de vuelta a la lista
        router.push('/user');
      } else {
        // Crear usuario - password no se incluye, se genera token automáticamente
        const createData = { ...formData };
        delete createData.password;
        
        const response: any = await createUser(createData);
        console.log('User created successfully:', response);
        
        // Si hay token de reset, mostrar diálogo
        if (response.reset_token) {
          setResetTokenDialog({
            open: true,
            token: response.reset_token,
            resetUrl: response.reset_url,
          });
        } else {
          // Si no hay token, navegar de vuelta
          router.push('/user');
        }
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      // Manejar errores de la API y mostrar en el formulario
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResetDialog = () => {
    setResetTokenDialog({ open: false });
    router.push('/user');
  };

  const handleCopyResetUrl = () => {
    if (resetTokenDialog.resetUrl) {
      navigator.clipboard.writeText(resetTokenDialog.resetUrl);
      console.log('URL copiada al portapapeles');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">
          {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </Typography>
      </Box>

      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Información Básica */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Información Básica
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={handleChange('nombre')}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Apellidos"
                value={formData.apellidos}
                onChange={handleChange('apellidos')}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
                required
                disabled={loading}
              />
            </Stack>

            <TextField
              fullWidth
              label="RUT"
              value={formData.rut}
              onChange={handleChange('rut')}
              error={!!errors.rut}
              helperText={errors.rut}
              placeholder="12.345.678-9"
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              select
              label="Rol"
              value={formData.role_slug}
              onChange={handleChange('role_slug')}
              error={!!errors.role_slug}
              helperText={errors.role_slug}
              required
              disabled={loading}
            >
              {roles.map((role) => (
                <MenuItem key={role.slug} value={role.slug}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>

            {!isEditMode && (
              <Alert severity="info">
                Se generará automáticamente un enlace para que el usuario configure su contraseña. El enlace será enviado por correo electrónico.
              </Alert>
            )}

            {/* Información de Contacto */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Información de Contacto
            </Typography>

            <TextField
              fullWidth
              label="Dirección"
              value={formData.direccion}
              onChange={handleChange('direccion')}
              error={!!errors.direccion}
              helperText={errors.direccion}
              multiline
              rows={2}
              disabled={loading}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={handleChange('telefono')}
                error={!!errors.telefono}
                helperText={errors.telefono}
                placeholder="+56 2 2345 6789"
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Celular"
                value={formData.celular}
                onChange={handleChange('celular')}
                error={!!errors.celular}
                helperText={errors.celular}
                placeholder="+56 9 1234 5678"
                disabled={loading}
              />
            </Stack>

            {/* Botones de Acción */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 3, justifyContent: 'flex-end' }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
              >
                {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      </Card>

      {/* Diálogo para mostrar el enlace de reset de contraseña */}
      <Dialog
        open={resetTokenDialog.open}
        onClose={handleCloseResetDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Usuario Creado Exitosamente</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="success">
              El usuario ha sido creado exitosamente. Se ha generado un enlace para que pueda establecer su contraseña.
            </Alert>
            
            <Typography variant="body2" color="text.secondary">
              Comparte este enlace con el usuario para que pueda establecer su contraseña:
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              value={resetTokenDialog.resetUrl || ''}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                },
              }}
            />
            
            <Alert severity="info">
              Este enlace expirará en 7 días y solo puede ser usado una vez.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyResetUrl}>
            Copiar Enlace
          </Button>
          <Button onClick={handleCloseResetDialog} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

export default UserFormView;
