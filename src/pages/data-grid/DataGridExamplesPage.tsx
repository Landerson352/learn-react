import * as UI from '@chakra-ui/react';
import React from 'react';
import _ from 'lodash';
import * as ReactTable from '@tanstack/react-table';

import { delay } from '../../helpers/delay';
import { useTableWithFetch } from './useTableWithFetch';
import { DataTable } from './components/DataTable';
import { DataTablePagination } from './components/DataTablePagination';

type UnitConversion = {
  fromUnit: string;
  toUnit: string;
  factor: number;
};

const rawData: UnitConversion[] = [
  {
    fromUnit: 'inches',
    toUnit: 'millimetres (mm)',
    factor: 25.4,
  },
  {
    fromUnit: 'feet',
    toUnit: 'centimetres (cm)',
    factor: 30.48,
  },
  {
    fromUnit: 'yards',
    toUnit: 'metres (m)',
    factor: 0.91444,
  },
  {
    fromUnit: 'inches',
    toUnit: 'millimetres (mm)',
    factor: 25.4,
  },
  {
    fromUnit: 'feet',
    toUnit: 'centimetres (cm)',
    factor: 30.48,
  },
  {
    fromUnit: 'yards',
    toUnit: 'metres (m)',
    factor: 0.91444,
  },
  {
    fromUnit: 'inches',
    toUnit: 'millimetres (mm)',
    factor: 25.4,
  },
  {
    fromUnit: 'feet',
    toUnit: 'centimetres (cm)',
    factor: 30.48,
  },
  {
    fromUnit: 'yards',
    toUnit: 'metres (m)',
    factor: 0.91444,
  },
  {
    fromUnit: 'inches',
    toUnit: 'millimetres (mm)',
    factor: 25.4,
  },
  {
    fromUnit: 'feet',
    toUnit: 'centimetres (cm)',
    factor: 30.48,
  },
  {
    fromUnit: 'yards',
    toUnit: 'metres (m)',
    factor: 0.91444,
  },
];

const columnHelper = ReactTable.createColumnHelper<UnitConversion>();

const columns = [
  columnHelper.accessor('fromUnit', {
    cell: (info) => info.getValue(),
    header: 'To convert',
  }),
  columnHelper.accessor('toUnit', {
    cell: (info) => info.getValue(),
    header: 'Into',
  }),
  columnHelper.accessor('factor', {
    cell: (info) => info.getValue(),
    header: 'Multiply by',
    meta: {
      isNumeric: true,
    },
  }),
];

const DataGridExamplesPage: React.FC = () => {
  const [table, { fetching, loading }] = useTableWithFetch(
    { columns }, // react-table options, must include column definitions
    async (state) => {
      // State contains updated sorting, filtering and pagination.
      // This function is called whenever the state changes.

      // Mock fetching data based on state.
      await delay(1000);
      return _.sampleSize(rawData, state.pagination.pageSize);
    }
  );

  // Fade the UI and disable clicks when fetching data.
  const containerProps: UI.BoxProps = fetching
    ? {
        pointerEvents: 'none',
        opacity: 0.5,
      }
    : {};

  return (
    <UI.Box p="4">
      <UI.VStack alignItems="stretch" spacing={4}>
        <UI.Box bg="white" borderRadius="8px" py={2}>
          <UI.Box {...containerProps}>
            {/* These display components are blind to the data fetching. */}
            <DataTable skeleton={loading} table={table} />
            <DataTablePagination table={table} />
          </UI.Box>
        </UI.Box>
      </UI.VStack>
    </UI.Box>
  );
};

export default DataGridExamplesPage;
