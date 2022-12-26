import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
};

const columnHelper = ReactTable.createColumnHelper<Person>();

const columns = {
  firstName: columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    header: 'First name',
  }),
  lastName: columnHelper.accessor('lastName', {
    cell: (info) => info.getValue(),
    header: 'Last name',
  }),
  age: columnHelper.accessor('age', {
    cell: (info) => info.getValue(),
    header: 'Age',
    meta: {
      isNumeric: true,
    },
  }),
};

export const getPersonColumns = (filterKeys?: (keyof Person)[]) => {
  if (filterKeys) return Object.values(_.pick(columns, filterKeys));
  return Object.values(columns);
};
