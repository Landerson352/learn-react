import * as UI from '@chakra-ui/react';
import * as ReactTable from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { DataTableSkeleton } from './DataTableSkeleton';
import {
  DataTableColumnFilter,
  DataTableColumnFilterProps,
} from './DataTableColumnFilter';
import { ComponentOverride } from '../../../helpers/componentOverride';

export type DataTableProps<Data extends object> = {
  skeleton?: boolean;
  table: ReactTable.Table<Data>;
  columnFilter?: ComponentOverride<DataTableColumnFilterProps<Data>>;
} & UI.TableProps;

/**
 * A display component for react-table + ChakraUI.
 */
export function DataTable<Data extends object>({
  skeleton,
  table,
  columnFilter,
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

              const alignment = meta?.isNumeric ? 'right' : 'left';
              const flexAlignment = meta?.isNumeric ? 'end' : 'start';

              const buttonElements = [
                <UI.Text>
                  {ReactTable.flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </UI.Text>,
                <UI.Box display="inline-block" w={3}>
                  {sortIcon}
                </UI.Box>,
              ];

              return (
                <UI.Th
                  key={header.id}
                  colSpan={header.colSpan}
                  isNumeric={meta?.isNumeric}
                  px={3}
                >
                  <UI.VStack alignItems={flexAlignment} spacing={1}>
                    <UI.Button
                      variant="ghost"
                      size="sm"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <UI.HStack>
                        {alignment === 'right'
                          ? buttonElements.reverse()
                          : buttonElements}
                      </UI.HStack>
                    </UI.Button>

                    {header.column.getCanFilter() && columnFilter !== false ? (
                      <DataTableColumnFilter
                        column={header.column}
                        {...columnFilter}
                        input={{ size: 'sm', ...columnFilter?.input }}
                      />
                    ) : null}
                  </UI.VStack>
                </UI.Th>
              );
            })}
          </UI.Tr>
        ))}
      </UI.Thead>
      {skeleton ? (
        <DataTableSkeleton
          rows={table.getState().pagination.pageSize}
          columns={table.getAllFlatColumns().length || 0}
        />
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
