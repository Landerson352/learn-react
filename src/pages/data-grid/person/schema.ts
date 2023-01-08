import * as zod from 'zod';
import {
  createColumns,
  createColumnsGetter,
  createFields,
  createFieldsGetter,
  Metas,
} from '../../../helpers/schemaHelpers';

/**
 * Person schema
 * Used to validate, generate table columns, and generate form fields
 */

// Note: The basis of this could be generated from a Prisma schema
// e.g.: https://www.npmjs.com/package/prisma-zod-generator
export const personSchema = zod.object({
  firstName: zod.string().min(2).max(20),
  lastName: zod.string().min(2).max(20),
  email: zod.string().email().optional().or(zod.literal('')), // Optioanl string format validators also need to allow for empty strings
  age: zod.number().min(0).max(100).optional(),
  favoriteColor: zod.string().optional(),
  isAlive: zod.boolean().optional(),
  bio: zod.string().optional(),
  state: zod.string().optional(),
});

export type Person = zod.infer<typeof personSchema>;

/**
 * Optional metadata for each field
 */
export const personMetas: Metas<Person> = {
  email: {
    helpText: "We won't share your email with anyone.",
  },
  isAlive: {
    label: 'Are you alive?', // label override
    trueStateLabel: 'Yes, I am currently alive and not dead',
  },
  favoriteColor: {
    label: 'Your aura color', // label override
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
    ],
    placeholder: 'Select a color',
  },
  bio: {
    multiline: true,
  },
};

export const personFields = createFields(personSchema, personMetas);
export const personColumns = createColumns(personSchema, personMetas);
export const getPersonFields = createFieldsGetter(personFields);
export const getPersonColumns = createColumnsGetter(personColumns);
