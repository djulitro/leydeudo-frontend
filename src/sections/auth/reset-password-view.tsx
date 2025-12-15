import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { apiClient } from 'src/utils/api-client';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ResetPasswordView() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    nombre: string;
    apellidos: string;
  } | null>(null);

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validar token al cargar
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        setIsValidating(false);
        setError('Token no proporcionado');
        return;
      }

      try {
        const response: any = await apiClient.post('/password/validate-token', { token });

        console.log(response);
        setIsValid(true);
        setUserInfo(response.user);
      } catch (err: any) {
        setIsValid(false);
        setError(err.response?.data?.message || 'Token inválido o expirado');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/password/reset', {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(true);

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al establecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Estado de carga inicial
  if (isValidating) {
    return (
      <Box
        sx={{
          height: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Validando token...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Token inválido
  if (!isValid) {
    return (
      <Box
        sx={{
          height: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'error.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
              }}
            >
              ⚠️
            </Box>
            <Typography variant="h5">Token Inválido</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {error || 'El enlace para establecer la contraseña es inválido o ha expirado.'}
            </Typography>
            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              onClick={() => navigate('/login')}
            >
              Ir al Login
            </LoadingButton>
          </Stack>
        </Card>
      </Box>
    );
  }

  // Formulario de cambio de contraseña
  return (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Establecer Contraseña</Typography>
            {userInfo && (
              <Typography variant="body2" color="text.secondary">
                Bienvenido {userInfo.nombre} {userInfo.apellidos}. Por favor, establece tu
                contraseña para acceder al sistema.
              </Typography>
            )}
          </Stack>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success">
              Contraseña establecida exitosamente. Redirigiendo al login...
            </Alert>
          )}

          {!success && (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Mínimo 8 caracteres"
                />

                <TextField
                  fullWidth
                  name="password_confirmation"
                  label="Confirmar Contraseña"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                          edge="end"
                        >
                          <Iconify icon={showPasswordConfirmation ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={loading}
                >
                  Establecer Contraseña
                </LoadingButton>
              </Stack>
            </Box>
          )}
        </Stack>
      </Card>
    </Box>
  );
}
