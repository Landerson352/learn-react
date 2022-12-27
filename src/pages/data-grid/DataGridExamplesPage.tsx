import * as UI from '@chakra-ui/react';
import React from 'react';

import { fetchPersons } from './person/queries';
import { getPersonColumns } from './person/schema';
import { DataGrid } from './components/DataGrid';

const DataGridExamplesPage: React.FC = () => {
  return (
    <UI.Box p="4">
      <UI.VStack alignItems="stretch" spacing={4}>
        <UI.Box bg="white" borderRadius="8px" overflow="hidden">
          <DataGrid
            options={{ columns: getPersonColumns() }}
            fetchDataFromState={fetchPersons}
            // globalFilter={{
            //   bg: 'gray.500',
            //   icon: false,
            //   input: { bg: 'white' },
            // }}
            // dataTable={{ fontSize: '2xl' }}
            // pagination={false}
          />
        </UI.Box>
      </UI.VStack>
    </UI.Box>
  );
};

export default DataGridExamplesPage;
