import React from 'react';

import { 
  Typography, 
  Box, 
  Card, 
  Table, 
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableSortLabel,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

import { TableEmptyRows } from './table-empty-rows';

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

type HeadLabel = { id: string; label: string; align?: string; width?: number; minWidth?: number };

type DataTableProps<T> = {
  table: any; // small abstraction of useTable returned object
  rows: T[]; // already filtered/sorted data
  totalRows: number; // total rows count before pagination (for pagination controls)
  headLabel: HeadLabel[];
  renderRow: (row: T, selected: boolean, onSelectRow: () => void) => React.ReactNode;
  renderToolbar?: ((numSelected: number, filterName: string, onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void) => React.ReactNode) | null;
  emptyMessage?: string; // Mensaje a mostrar cuando no hay datos
  rowsPerPageOptions?: number[];
  showCheckboxes?: boolean; // Control si se muestran los checkboxes de selección
  showSorting?: boolean; // Control si se muestra el ordenamiento
};

export function DataTable<T>({
  table,
  rows,
  totalRows,
  headLabel,
  renderRow,
  renderToolbar = null,
  emptyMessage = 'No se encontraron resultados',
  rowsPerPageOptions = [5, 10, 25],
  showCheckboxes = true,
  showSorting = true,
}: DataTableProps<T>) {
  const notFound = !rows.length && !!(renderToolbar ? (table.filterName || '') : false);
  const colSpan = headLabel.length + (showCheckboxes ? 1 : 0);

  return (
    <Card>
      {renderToolbar && (
        <>
          {renderToolbar(
            table.selected.length,
            table.filterName,
            (event: React.ChangeEvent<HTMLInputElement>) => {
              if (table.setFilterName) table.setFilterName(event.target.value);
              if (table.onResetPage) table.onResetPage();
            }
          )}
        </>
      )}

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                {showCheckboxes && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={table.selected.length > 0 && table.selected.length < totalRows}
                      checked={totalRows > 0 && table.selected.length === totalRows}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        table.onSelectAllRows(
                          event.target.checked,
                          table.allRowIds || rows.map((row: any) => row.id)
                        )
                      }
                    />
                  </TableCell>
                )}

                {headLabel.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={(headCell.align as 'center' | 'left' | 'right' | 'inherit' | 'justify') || 'left'}
                    sortDirection={table.orderBy === headCell.id ? table.order : false}
                    sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                  >
                    {showSorting && headCell.id ? (
                      <TableSortLabel
                        hideSortIcon
                        active={table.orderBy === headCell.id}
                        direction={table.orderBy === headCell.id ? table.order : 'asc'}
                        onClick={() => table.onSort(headCell.id)}
                      >
                        {headCell.label}
                        {table.orderBy === headCell.id ? (
                          <Box sx={{ ...visuallyHidden }}>
                            {table.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows
                .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                .map((row: any) => (
                  <React.Fragment key={row.id}>
                    {renderRow(
                      row,
                      table.selected.includes(row.id),
                      () => table.onSelectRow(row.id)
                    )}
                  </React.Fragment>
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={
                  table.page > 0 
                    ? Math.max(0, table.rowsPerPage - rows.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage).length)
                    : 0
                }
              />

              {notFound && (
                <TableRow>
                  <TableCell align="center" colSpan={colSpan}>
                    <Box sx={{ py: 15, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No se encontraron resultados
                      </Typography>

                      <Typography variant="body2">
                        {emptyMessage}
                        {table.filterName && (
                          <>
                            <br />
                            Búsqueda: <strong>&quot;{table.filterName}&quot;</strong>
                          </>
                        )}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        component="div"
        page={table.page}
        count={totalRows}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

export default DataTable;