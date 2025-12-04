import type { ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuthContext } from 'src/contexts/auth-context';

// ----------------------------------------------------------------------

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
