import { useState, useCallback } from 'react';

export type Order = 'asc' | 'desc';

export type UseTableReturn = {
  page: number;
  order: Order;
  orderBy: string;
  rowsPerPage: number;
  selected: string[];
  onSort: (id: string) => void;
  onSelectAllRows: (checked: boolean, newSelecteds: string[]) => void;
  onSelectRow: (id: string) => void;
  onResetPage: () => void;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useTable(initialOrderBy: string = 'name', initialRowsPerPage: number = 5): UseTableReturn {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<Order>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback((id: string) => {
    const newSelected = selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id];
    setSelected(newSelected);
  }, [selected]);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    onResetPage();
  }, [onResetPage]);

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
