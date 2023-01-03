import * as zod from 'zod';
import {
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
  isAlive: zod.boolean().optional(),
  bio: zod.string().optional(),
});

export type Person = zod.infer<typeof validator>;

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
  bio: {
    control: 'textarea',
  },
};

const getColumns = createColumnGetter(validator, metas);

export const personSchema = {
  validator,
  getColumns,
  columns: getColumns(),
};
