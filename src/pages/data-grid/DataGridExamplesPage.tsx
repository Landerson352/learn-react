import * as UI from '@chakra-ui/react';
import React from 'react';
import _ from 'lodash';
import * as ReactTable from '@tanstack/react-table';
import { DataTable } from './components/DataTable';

const DataGridIntro: React.FC = () => {
  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with data grids
      </UI.Heading>
      <UI.Text mb={4}>...</UI.Text>
    </UI.Box>
  );
};

type UnitConversion = {
  fromUnit: string;
  toUnit: string;
  factor: number;
};

const data: UnitConversion[] = [
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
  const exampleComponents = [DataGridIntro];

  return (
    <UI.Box p="4">
      <UI.Heading size="3xl" mb={8}>
        Data grid examples
      </UI.Heading>

      <UI.VStack alignItems="start" spacing={4}>
        {/* <UI.SimpleGrid minChildWidth="400px" spacing={2} mb={8}> */}
        {_.map(exampleComponents, (Component) => (
          <UI.Box
            key={Component.name}
            bg="white"
            borderRadius="8px"
            p={6}
            // minH="240px"
            maxW="360px"
            w="100%"
          >
            <Component />
          </UI.Box>
        ))}
        {/* </UI.SimpleGrid> */}

        <UI.Box bg="white" borderRadius="8px" py={2}>
          <DataTable columns={columns} data={data} />
        </UI.Box>
      </UI.VStack>
    </UI.Box>
  );
};

export default DataGridExamplesPage;
