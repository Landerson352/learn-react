import * as zod from 'zod';
import {
  createColumns,
  createColumnsGetter,
  createFields,
  createFieldsGetter,
  EntityMeta,
} from './../helpers/createColumnGetter';

/**
 * Person schema
 * Used to validate, generate table columns, and generate form fields
 */

// Note: this could be generated from a database schema
export const personSchema = zod.object({
  firstName: zod.string().min(2).max(20),
  lastName: zod.string().min(2).max(20),
  email: zod.string().email().optional(),
  age: zod.number().min(0).max(100),
  favoriteColor: zod.string().optional(),
  isAlive: zod.boolean().optional(),
  bio: zod.string().optional(),
});

export type Person = zod.infer<typeof personSchema>;

export const personMetas: EntityMeta<Person> = {
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

export const personFields = createFields(personSchema, personMetas);
export const personColumns = createColumns(personSchema, personMetas);
export const getPersonFields = createFieldsGetter(personFields);
export const getPersonColumns = createColumnsGetter(personColumns);
