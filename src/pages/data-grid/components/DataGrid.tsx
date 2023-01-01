import * as UI from '@chakra-ui/react';

import { ComponentOverride } from '../../../helpers/componentOverride';
import { UseTableWithFetchReturn } from '../hooks/useTableWithFetch';
import { DataTable, DataTableProps } from './DataTable';
import {
  DataTableGlobalFilter,
  DataTableGlobalFilterProps,
} from './DataTableGlobalFilter';
import {
  DataTablePagination,
  DataTablePaginationProps,
} from './DataTablePagination';

export type DataGridComponentOverrideProps<Data extends object> = {
  globalFilter?: ComponentOverride<DataTableGlobalFilterProps<Data>>;
  dataTable?: ComponentOverride<DataTableProps<Data>>;
  pagination?: ComponentOverride<DataTablePaginationProps<Data>>;
};

type DataGridProps<Data extends object> = UseTableWithFetchReturn<Data> &
  DataGridComponentOverrideProps<Data>;

/**
 * A flexible display componet for react-table + ChakraUI.
 * Supply your own table state, and override the components as needed.
 */
export function DataGrid<Data extends object>({
  table,
  fetching = false,
  loading = false,
  globalFilter,
  dataTable,
  pagination,
}: DataGridProps<Data>) {
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
      {globalFilter !== false ? (
        <DataTableGlobalFilter table={table} {...globalFilter} />
      ) : null}
      {dataTable !== false ? (
        <DataTable skeleton={loading} table={table} {...dataTable} />
      ) : null}
      {pagination !== false ? (
        <DataTablePagination table={table} {...pagination} />
      ) : null}
    </UI.Box>
  );
}
