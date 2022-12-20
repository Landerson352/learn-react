import React from 'react';
import * as ReactTable from '@tanstack/react-table';
import type { Promisable, SetOptional } from 'type-fest';

/**
 * useTableWithFetch is a wrapper around useReactTable that expects data to be fetched from a server.
 * @param options Providing anything other than "columns" may cause unexpected behaviour.
 * @param fetchDataFromState A function that returns data based on the state of the table.
 * @returns A tuple containing the table and an object containing the loading and fetching states.
 */
export function useTableWithFetch<T>(
  options: SetOptional<ReactTable.TableOptions<T>, 'data' | 'getCoreRowModel'>,
  fetchDataFromState: (state: ReactTable.TableState) => Promisable<T[]>
): [ReactTable.Table<T>, { fetching: boolean; loading: boolean }] {
  const [loading, setLoading] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [pageCount, setPageCount] = React.useState(100);
  const [state, setState] = React.useState<ReactTable.TableState>({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    sorting: [{}], // not sure why this is required
    ...options.initialState,
  } as ReactTable.TableState);
  const [data, setData] = React.useState<T[]>([]);

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
  }, []);

  const table = ReactTable.useReactTable({
    ...options,
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

  return [table, { loading, fetching }];
}
