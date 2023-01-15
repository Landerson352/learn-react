import * as UI from '@chakra-ui/react';
import React from 'react';

import { DataGridWithFetch } from './components/DataGridWithFetch';
import { fetchPersons } from './person/queries';
import { getPersonColumns, personColumns } from './person/schema';

const columns = personColumns; // display all columns
// const columns = getPersonColumns([
//   'firstName',
//   // 'lastName',
//   // 'email',
//   // 'phone',
//   // 'isAlive',
//   'startDate',
// ]); // display only a subset of columns

const DataGridExamplesPage: React.FC = () => {
  return (
    <UI.Box p={4}>
      <UI.VStack alignItems="stretch" spacing={4}>
        <UI.Box bg="white" borderRadius="lg" overflow="hidden">
          <DataGridWithFetch
            tableOptions={{ columns }}
            fetchDataFromState={fetchPersons}
            // globalFilter={false}
            // dataTable={{ columnFilter: false }}
            // pagination={false}
            dataTable={{ size: 'sm' }}
          />
        </UI.Box>
      </UI.VStack>
    </UI.Box>
  );
};

export default DataGridExamplesPage;
