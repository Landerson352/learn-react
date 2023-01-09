import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';

import { delay } from '../../../helpers/delay';
import { Person } from './schema';

const rawData: Person[] = [
  {
    firstName: 'Albert',
    lastName: 'Anderson',
    age: 18,
  },
  {
    firstName: 'Bert',
    lastName: 'Bertson',
    age: 19,
  },
  {
    firstName: 'Charles',
    lastName: 'Charletson',
    age: 20,
  },
  {
    firstName: 'David',
    lastName: 'Davidson',
    age: 21,
  },
  {
    firstName: 'Edward',
    lastName: 'Edwards',
    age: 22,
  },
  {
    firstName: 'Frank',
    lastName: 'Franklin',
    age: 23,
  },
  {
    firstName: 'George',
    lastName: 'Georgetown',
    age: 24,
  },
  {
    firstName: 'Henry',
    lastName: 'Henrietta',
    age: 25,
  },
  {
    firstName: 'Isaac',
    lastName: 'Isaacson',
    age: 26,
  },
  {
    firstName: 'John',
    lastName: 'Johnson',
    age: 27,
  },
  {
    firstName: 'Karl',
    lastName: 'Karlson',
    age: 28,
  },
  {
    firstName: 'Louis',
    lastName: 'Louisville',
    age: 29,
  },
  {
    firstName: 'Martin',
    lastName: 'Martinson',
    age: 30,
  },
  {
    firstName: 'Nathan',
    lastName: 'Nathanson',
    age: 31,
  },
  {
    firstName: 'Olli',
    lastName: 'Oliver',
    age: 32,
  },
  {
    firstName: 'Peter',
    lastName: 'Peterson',
    age: 33,
  },
];

export const fetchPersons = async (
  state: ReactTable.TableState
): Promise<Person[]> => {
  // State contains updated sorting, filtering and pagination.
  // This function is called whenever the state changes.

  console.log('fetching Persons with state:', state);

  // Mock fetching data based on state.
  await delay(1000);
  return _.sampleSize(rawData, state.pagination.pageSize);
};
