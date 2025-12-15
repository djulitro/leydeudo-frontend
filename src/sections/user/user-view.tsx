import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { useTable } from 'src/hooks/use-table';

import { activated, getUsers, disable } from 'src/api';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuthContext } from 'src/contexts/auth-context';

import { Iconify } from 'src/components/iconify';
import DataTable from 'src/components/data-table/data-table';

import { UserTableRow } from './components/user-table-row';
import { UserTableToolbar } from './components/user-table-toolbar';

import type { UserProps } from './components/user-table-row';
import { hasPermission } from 'src/utils/permissions';

// ----------------------------------------------------------------------

export function UserView() {
  const router = useRouter();
  const table = useTable();
  const { user: currentUser } = useAuthContext();

  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState<UserProps[]>([]);

  const handleGetUsers = useCallback(async () => {
    try {
      const response: any = await getUsers();

      const users = response.users.filter((user: any) => user.id !== currentUser?.id);
      
      setTableData(users.map((user: any) => ({
        id: user.id,
        name: `${user.nombre ?? ''} ${user.apellidos ?? ''}`.trim(),
        email: user.email,
        role: user.roles?.[0]?.name ?? '',
        status: user.estado,
        avatarUrl: user.avatarUrl,
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [currentUser?.id]);

  const handleActivateUser = useCallback(async (userId: number) => {
    try {
      await activated(userId);
      
      await handleGetUsers();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }, [handleGetUsers]);

  const handleDesableUser = useCallback(async (userId: number) => {
    try {
      await disable(userId);

      await handleGetUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  }, [handleGetUsers]);

  useEffect(() => {
    handleGetUsers();
  }, [handleGetUsers]);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Usuarios
        </Typography>
        {
          hasPermission('users.create') ? (
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push('/user/create')}
            >
              Nuevo Usuario
            </Button>
          ) : null
        }

      </Box>

      <DataTable
        table={{
          ...table,
          filterName,
          setFilterName,
          allRowIds: tableData.map((u) => u.id),
        }}
        rows={tableData}
        totalRows={tableData.length}  
        headLabel={[
          { id: 'name', label: 'Nombre' },
          { id: 'email', label: 'Email' },
          { id: 'role', label: 'Role' },
          { id: 'status', label: 'Estado' },
          { id: '', label: '' },
        ]}
        renderRow={(row, selected, onSelectRow) => (
          <UserTableRow
            key={row.id}
            row={row}
            selected={selected}
            onSelectRow={onSelectRow}
            activatedUser={handleActivateUser}
            disabledUser={handleDesableUser}
          />
        )}
        renderToolbar={(numSelected, filterValue, onFilterChange) => (
          <UserTableToolbar
            numSelected={numSelected}
            filterName={filterValue}
            onFilterName={onFilterChange}
          />
        )}
        emptyMessage="No se encontraron usuarios con los criterios de búsqueda"
        rowsPerPageOptions={[5, 10, 25]}
        showCheckboxes
        showSorting
      />
    </DashboardContent>
  );
}
