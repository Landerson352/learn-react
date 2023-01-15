import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';

import { delay } from '../../../helpers/delay';
import { Person } from './schema';

const rawData: Person[] = [
  {
    firstName: 'Albert',
    lastName: 'Anderson',
    age: 18,
    isAlive: true,
    phone: '1234567890',
    email: 'albert.anderson@gmail.com',
    startDate: new Date(),
    favoriteColor: 'red',
  },
  {
    firstName: 'Bert',
    lastName: 'Bertson',
    age: 19,
    isAlive: true,
    phone: '1234567890',
    email: 'bert.bertson@gmail.com',
    favoriteColor: 'red',
  },
  {
    firstName: 'Charles',
    lastName: 'Charletson',
    age: 20,
    isAlive: true,
    phone: '1234567890',
    favoriteColor: 'green',
  },
  {
    firstName: 'David',
    lastName: 'Davidson',
    age: 21,
    isAlive: true,
    phone: '1234567890',
    startDate: new Date(),
    favoriteColor: 'green',
  },
  {
    firstName: 'Edward',
    lastName: 'Edwards',
    age: 22,
    email: 'edward.edwards@gmail.com',
    startDate: new Date(),
    favoriteColor: 'blue',
  },
  {
    firstName: 'Frank',
    lastName: 'Franklin',
    age: 23,
    isAlive: true,
    email: 'frank.franklin@gmail.com',
    favoriteColor: 'blue',
  },
  {
    firstName: 'George',
    lastName: 'Georgetown',
    age: 24,
    isAlive: true,
    startDate: new Date(),
  },
  {
    firstName: 'Henry',
    lastName: 'Henrietta',
    age: 25,
    isAlive: true,
  },
  {
    firstName: 'Isaac',
    lastName: 'Isaacson',
    age: 26,
    isAlive: false,
    phone: '1234567890',
    email: 'isaac.isaacson@gmail.com',
  },
  {
    firstName: 'John',
    lastName: 'Johnson',
    age: 27,
    isAlive: false,
    phone: '1234567890',
    email: 'john.johnson@gmail.com',
    startDate: new Date(),
    favoriteColor: 'red',
  },
  {
    firstName: 'Karl',
    lastName: 'Karlson',
    age: 28,
    phone: '1234567890',
    startDate: new Date(),
    favoriteColor: 'red',
  },
  {
    firstName: 'Louis',
    lastName: 'Louisville',
    age: 29,
    isAlive: false,
    phone: '1234567890',
    favoriteColor: 'green',
  },
  {
    firstName: 'Martin',
    lastName: 'Martinson',
    age: 30,
    isAlive: false,
    email: 'martin.martinson@gmail.com',
    favoriteColor: 'green',
  },
  {
    firstName: 'Nathan',
    lastName: 'Nathanson',
    age: 31,
    isAlive: false,
    email: 'nathan.nathanson@gmail.com',
  },
  {
    firstName: 'Olli',
    lastName: 'Oliver',
    age: 32,
    startDate: new Date(),
  },
  {
    firstName: 'Peter',
    lastName: 'Peterson',
    age: 33,
    isAlive: false,
    startDate: new Date(),
    favoriteColor: 'blue',
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
