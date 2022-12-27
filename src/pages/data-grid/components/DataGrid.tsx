import * as UI from '@chakra-ui/react';

import { ComponentOverride } from '../../../helpers/componentOverride';
import {
  FetchDataFromState,
  TableWithFetchOptions,
  useTableWithFetch,
} from '../hooks/useTableWithFetch';
import { DataTable, DataTableProps } from './DataTable';
import {
  DataTableGlobalFilter,
  DataTableGlobalFilterProps,
} from './DataTableGlobalFilter';
import {
  DataTablePagination,
  DataTablePaginationProps,
} from './DataTablePagination';

// TODO: extract fetching hook, and wrap DataGrid with "DataGridWithFetch" component.
export function DataGrid<T extends object>({
  options,
  fetchDataFromState,
  globalFilter = {},
  dataTable = {},
  pagination = {},
}: {
  options: TableWithFetchOptions<T>;
  fetchDataFromState: FetchDataFromState<T>;
  globalFilter?: ComponentOverride<DataTableGlobalFilterProps<T>>;
  dataTable?: ComponentOverride<DataTableProps<T>>;
  pagination?: ComponentOverride<DataTablePaginationProps<T>>;
}) {
  const { table, fetching, loading } = useTableWithFetch<T>(
    options,
    fetchDataFromState
  );

  // Fade the UI and disable clicks when fetching data.
  const containerProps: UI.BoxProps = fetching
    ? {
        pointerEvents: 'none',
        opacity: 0.5,
      }
    : {};

  // TODO: Add fetching context, and use it to soft-disable debounced inputs

  return (
    <UI.Box {...containerProps}>
      {globalFilter ? (
        <DataTableGlobalFilter table={table} {...globalFilter} />
      ) : null}
      {dataTable ? (
        <DataTable skeleton={loading} table={table} {...dataTable} />
      ) : null}
      {pagination ? (
        <DataTablePagination table={table} {...pagination} />
      ) : null}
    </UI.Box>
  );
}
