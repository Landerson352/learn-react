import * as React from 'react';
import * as UI from '@chakra-ui/react';
import * as ReactTable from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ReactTable.ColumnDef<Data, any>[];
  tableOptions?: Partial<
    Pick<ReactTable.TableOptions<Data>, 'onSortingChange'>
  >;
  onStateChange?: (state: Partial<ReactTable.TableState>) => void;
  manual?: boolean;
};

// Notes:
// When implementing table you must decide how to want to manage state.
// Consider WHERE the sorting, filtering, and pagination occurs.
// If it occurs in the component, you can leverage the automatic management of state.
// If it occurs on the server, you will want to manage it manually.

export function DataTable<Data extends object>({
  data,
  columns,
  tableOptions,
  onStateChange,
  manual,
}: DataTableProps<Data>): JSX.Element {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<ReactTable.PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
  const [sorting, setSorting] = React.useState<ReactTable.SortingState>([]);
  const state = {
    pagination: {
      pageIndex,
      pageSize,
    },
    sorting,
  };

  // callback when state object changes
  // in "manual" implementations, the callback should update the data prop
  React.useEffect(() => {
    onStateChange?.(state);
  }, [JSON.stringify(state)]);

  const table = ReactTable.useReactTable({
    columns,
    data,
    getCoreRowModel: ReactTable.getCoreRowModel(),

    // These calls used by automatic management in local (component) state
    getFilteredRowModel: ReactTable.getFilteredRowModel(),
    getPaginationRowModel: ReactTable.getPaginationRowModel(),
    getSortedRowModel: ReactTable.getSortedRowModel(),

    // Local state is only used with automatic management, otherwise ignored
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state,

    // When using manual management you must instead update the data
    manualFiltering: manual,
    manualPagination: manual,
    manualSorting: manual,

    ...tableOptions,
  });

  return (
    <React.Fragment>
      <DataTableView table={table} />
      <DataTablePagination table={table} />
    </React.Fragment>
  );
}

export function DataTablePagination<Data extends object>({
  table,
}: {
  table: ReactTable.Table<Data>;
}): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="border p-1 rounded w-16"
        />
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DataTableView<Data extends object>({
  table,
}: {
  table: ReactTable.Table<Data>;
}): JSX.Element {
  return (
    <UI.Table>
      <UI.Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <UI.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = header.column.columnDef.meta;

              const sortIcon = header.column.getIsSorted() ? (
                header.column.getIsSorted() === 'desc' ? (
                  <FontAwesomeIcon icon={faChevronDown} />
                ) : (
                  <FontAwesomeIcon icon={faChevronUp} />
                )
              ) : null;

              return (
                <UI.Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                  cursor="pointer"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                >
                  {meta?.isNumeric ? (
                    <UI.Box display="inline-block" w={3} mr={2}>
                      {sortIcon}
                    </UI.Box>
                  ) : null}

                  {ReactTable.flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {meta?.isNumeric ? null : (
                    <UI.Box display="inline-block" w={3} ml={2}>
                      {sortIcon}
                    </UI.Box>
                  )}
                </UI.Th>
              );
            })}
          </UI.Tr>
        ))}
      </UI.Thead>
      <UI.Tbody>
        {table.getRowModel().rows.map((row) => (
          <UI.Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = cell.column.columnDef.meta;
              return (
                <UI.Td key={cell.id} isNumeric={meta?.isNumeric}>
                  {ReactTable.flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </UI.Td>
              );
            })}
          </UI.Tr>
        ))}
      </UI.Tbody>
    </UI.Table>
  );
}
