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
  email: zod.string().email().optional(),
  age: zod.number().min(0).max(100).optional(),
  favoriteColor: zod.string().optional(),
  isAlive: zod.boolean().optional(),
  bio: zod.string().optional(),
});

export type Person = zod.infer<typeof personSchema>;

/**
 * Optional metadata for each field
 */
export const personMetas: Metas<Person> = {
  email: {
    helpText: "We won't share your email with anyone.",
  },
  favoriteColor: {
    // Example label override
    label: 'Your color',
  },
};

export const personFields = createFields(personSchema, personMetas);
export const personColumns = createColumns(personSchema, personMetas);
export const getPersonFields = createFieldsGetter(personFields);
export const getPersonColumns = createColumnsGetter(personColumns);
