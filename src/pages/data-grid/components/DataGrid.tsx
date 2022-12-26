import * as UI from '@chakra-ui/react';

import {
  FetchDataFromState,
  TableWithFetchOptions,
  useTableWithFetch,
} from '../hooks/useTableWithFetch';
import { DataTable, DataTableProps } from './DataTable';
import {
  DataTablePagination,
  DataTablePaginationProps,
} from './DataTablePagination';

type ComponentOverride<Props extends object> = false | Partial<Props>;

// TODO: component prop objects, optional paging
export function DataGrid<T extends object>({
  options,
  fetchDataFromState,
  dataTable = {},
  pagination = {},
}: {
  options: TableWithFetchOptions<T>;
  fetchDataFromState: FetchDataFromState<T>;
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

  return (
    <UI.Box {...containerProps}>
      {dataTable ? (
        <DataTable skeleton={loading} table={table} {...dataTable} />
      ) : null}
      {pagination ? (
        <DataTablePagination table={table} {...pagination} />
      ) : null}
    </UI.Box>
  );
}
