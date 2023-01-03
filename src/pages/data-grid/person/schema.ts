import * as zod from 'zod';
import {
  ColumnExtras,
  createColumnGetter,
  EntityMeta,
} from './../helpers/createColumnGetter';

/**
 * Person schema
 * Used to validate, generate columns, and generate form fields
 */

// Note: this could be generated from a database schema
const validator = zod.object({
  firstName: zod.string().min(2).max(20),
  lastName: zod.string().min(2).max(20),
  email: zod.string().email().optional(),
  age: zod.number().min(0).max(100),
  favoriteColor: zod.string().optional(),
});

export type Person = zod.infer<typeof validator>;

// TODO: replace the "extras" with a "meta" object that has everything used to drive the form
// and then create the table columns by merging the meta object

const metas: EntityMeta<Person> = {
  email: {
    helpText: "We won't share your email with anyone.",
  },
  favoriteColor: {
    label: 'Color',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
    ],
  },
};

const columnExtras: ColumnExtras<Person> = {
  email: {
    meta: { helpText: "We won't share your email with anyone." },
  },
  favoriteColor: {
    header: 'Color',
    meta: {
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Blue', value: 'blue' },
      ],
    },
  },
};

const getColumns = createColumnGetter(validator, columnExtras);

export const personSchema = {
  validator,
  getColumns,
  columns: getColumns(),
};
