import * as UI from '@chakra-ui/react';
import React from 'react';

import { fetchPersons } from './person/queries';
import { DataGridWithFetch } from './components/DataGridWithFetch';
import { personSchema } from './person/schema';

const DataGridExamplesPage: React.FC = () => {
  return (
    <UI.Box p={4}>
      <UI.VStack alignItems="stretch" spacing={4}>
        <UI.Box bg="white" borderRadius="lg" overflow="hidden" p={4}>
          <DataGridWithFetch
            tableOptions={{ columns: personSchema.columns }}
            fetchDataFromState={fetchPersons}
            // globalFilter={{
            //   bg: 'gray.500',
            //   icon: { opacity: 0.5, icon: faSave },
            //   input: { bg: 'white' },
            // }}
            // dataTable={{ fontSize: '2xl', columnFilter: false }}
            // pagination={false}
          />
        </UI.Box>
      </UI.VStack>
    </UI.Box>
  );
};

export default DataGridExamplesPage;
