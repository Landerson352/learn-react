import * as UI from '@chakra-ui/react';
import * as ReactTable from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

export type DataTableProps<Data extends object> = {
  skeleton?: boolean;
  table: ReactTable.Table<Data>;
} & UI.TableProps;

export function DataTable<Data extends object>({
  skeleton,
  table,
  ...tableProps
}: DataTableProps<Data>): JSX.Element {
  return (
    <UI.Table {...tableProps}>
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
      {skeleton ? (
        <UI.Tbody>
          {_.times(table.getState().pagination.pageSize, (i) => (
            <UI.Tr key={i}>
              {_.last(table.getHeaderGroups())?.headers.map((header) => {
                return (
                  <UI.Td key={header.id}>
                    <UI.Box
                      bg="gray.100"
                      borderRadius="md"
                      color="gray.100"
                      _after={{
                        content: '"—"',
                        display: 'block',
                      }}
                    />
                  </UI.Td>
                );
              })}
            </UI.Tr>
          ))}
        </UI.Tbody>
      ) : (
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
      )}
    </UI.Table>
  );
}
