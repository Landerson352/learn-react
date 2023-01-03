import {
  useTableWithFetch,
  UseTableWithFetchOptions,
} from '../hooks/useTableWithFetch';
import { DataGrid, DataGridComponentOverrideProps } from './DataGrid';

type DataGridWithFetchProps<Data extends object> =
  UseTableWithFetchOptions<Data> & DataGridComponentOverrideProps<Data>;

/**
 * A convenience wrapper around DataGrid that manages table state with fetch functionality.
 */
export function DataGridWithFetch<Data extends object>({
  tableOptions,
  fetchDataFromState,
  ...restProps
}: DataGridWithFetchProps<Data>) {
  const tableWithFetch = useTableWithFetch<Data>({
    tableOptions,
    fetchDataFromState,
  });

  return <DataGrid {...tableWithFetch} {...restProps} />;
}