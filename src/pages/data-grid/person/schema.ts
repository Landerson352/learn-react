import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';
import * as zod from 'zod';

import { createColumnGetter } from './../helpers/createColumnGetter';

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
const colorOptions = colors.map((color) => ({
  label: _.startCase(color),
  value: color,
}));

// Note: this could be generated from a database schema
const validator = zod.object({
  firstName: zod.string().min(2).max(20),
  lastName: zod.string().min(2).max(20),
  email: zod.string().email().optional(),
  age: zod.number().min(0).max(100),
  favoriteColor: zod.string().optional(),
});

export type Person = zod.infer<typeof validator>;

const columnHelper = ReactTable.createColumnHelper<Person>();
const columns = [
  columnHelper.accessor('firstName', {}),
  columnHelper.accessor('lastName', {}),
  columnHelper.accessor('email', {
    meta: {
      helpText: "We won't share your email with anyone.",
    },
  }),
  columnHelper.accessor('age', {}),
  columnHelper.accessor('favoriteColor', {
    header: 'Color', // Custom header override
    meta: {
      options: colorOptions,
    },
  }),
];

const getColumns = createColumnGetter(columns, validator);

export const personSchema = {
  validator,
  getColumns,
  columns: getColumns(),
};
