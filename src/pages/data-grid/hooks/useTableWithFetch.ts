import * as ReactTable from '@tanstack/react-table';
import React from 'react';
import type { Promisable, SetOptional } from 'type-fest';

export type TableWithFetchOptions<Data extends object> = SetOptional<
  ReactTable.TableOptions<Data>,
  'data' | 'getCoreRowModel'
>;
export type FetchDataFromState<Data extends object> = (
  state: ReactTable.TableState
) => Promisable<Data[]>;

export type UseTableWithFetchOptions<Data extends object> = {
  tableOptions: TableWithFetchOptions<Data>;
  fetchDataFromState: FetchDataFromState<Data>;
};

export type UseTableWithFetchReturn<Data extends object> = {
  table: ReactTable.Table<Data>;
  fetching: boolean;
  loading: boolean;
};

/**
 * useTableWithFetch is a wrapper around useReactTable that expects data to be fetched from a server.
 * @param tableOptions Providing anything other than "columns" may cause unexpected behaviour.
 * @param fetchDataFromState A function that returns data based on the state of the table.
 * @returns A tuple containing the table and an object containing the loading and fetching states.
 */
export function useTableWithFetch<Data extends object>({
  tableOptions,
  fetchDataFromState,
}: UseTableWithFetchOptions<Data>): UseTableWithFetchReturn<Data> {
  const [loading, setLoading] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [pageCount, setPageCount] = React.useState(100);
  const [state, setState] = React.useState<ReactTable.TableState>({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    sorting: [{}], // not sure why this is required
    ...tableOptions.initialState,
  } as ReactTable.TableState);
  const [data, setData] = React.useState<Data[]>([]);

  const updateDataFromState = async (newState: ReactTable.TableState) => {
    setFetching(true);

    // Simulate server-side requests
    const newData = await fetchDataFromState(newState);
    setData(newData);
    // TODO: figure out how to capture pageCount, maybe as a returned tuple from fetchDataFromState?
    setPageCount(100);
    // TODO: if filters have changed, also reset page index to 0

    setFetching(false);
    setLoading(false);
  };

  // Initial load
  React.useEffect(() => {
    updateDataFromState(state);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const table = ReactTable.useReactTable({
    ...tableOptions,
    data,
    getCoreRowModel: ReactTable.getCoreRowModel(),

    // turn off internal state management
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,

    // apply controlled state
    pageCount,
    state,
    onStateChange: async (updater) => {
      const newState = typeof updater === 'function' ? updater(state) : updater;
      await updateDataFromState(newState);
      setState(newState);
    },
  });

  return { table, loading, fetching };
}
