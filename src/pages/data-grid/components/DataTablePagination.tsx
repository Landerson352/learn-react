import * as ReactTable from '@tanstack/react-table';
import * as UI from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

export type DataTablePaginationProps<Data extends object> = {
  table: ReactTable.Table<Data>;
} & UI.BoxProps;

export function DataTablePagination<Data extends object>({
  table,
  ...boxProps
}: DataTablePaginationProps<Data>): JSX.Element {
  return (
    <UI.VStack px={4} py={3} {...boxProps}>
      <UI.ButtonGroup size="sm">
        <UI.Button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </UI.Button>
        <UI.Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </UI.Button>
        <UI.Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </UI.Button>
        <UI.Button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </UI.Button>
      </UI.ButtonGroup>
      <UI.Box>
        Page {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}
      </UI.Box>

      {/* Advanced options */}
      {/* <UI.Select
        w="auto"
        size="sm"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize} per page
          </option>
        ))}
      </UI.Select> */}
      {/* <UI.HStack>
        <UI.Text fontSize="sm">Go to page</UI.Text>
        <UI.Input
          w={12}
          size="sm"
          textAlign="center"
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
      </UI.HStack> */}
    </UI.VStack>
  );
}
