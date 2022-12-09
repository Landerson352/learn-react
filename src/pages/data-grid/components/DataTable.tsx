import * as React from 'react';
import * as UI from '@chakra-ui/react';
import * as ReactTable from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ReactTable.ColumnDef<Data, any>[];
};

export function DataTable<Data extends object>({
  data,
  columns,
}: DataTableProps<Data>): JSX.Element {
  const [sorting, setSorting] = React.useState<ReactTable.SortingState>([]);
  const table = ReactTable.useReactTable({
    columns,
    data,
    getCoreRowModel: ReactTable.getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: ReactTable.getSortedRowModel(),
    state: {
      sorting,
    },
  });

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
