import * as zod from 'zod';

import {
  createColumns,
  createColumnsGetter,
  createFields,
  createFieldsGetter,
  createOptionalSchema,
  Metas,
} from '../../../helpers/schemaHelpers';

/**
 * Person schema
 * Used to validate, generate table columns, and generate form fields
 */

// TODO: consider if we need zod transforms for the backend (eg. '' -> null)

// Note: The basis of this could be generated from a Prisma schema
// e.g.: https://www.npmjs.com/package/prisma-zod-generator
export const personSchema = zod.object({
  firstName: zod.string().min(2).max(20),
  lastName: zod.string().min(2).max(20),
  city: createOptionalSchema(zod.string()),
  state: createOptionalSchema(zod.string()),
  zip: createOptionalSchema(
    zod.string().regex(/^\d{5}$|^\d{9}$/, 'Invalid zip code')
  ),
  email: createOptionalSchema(zod.string().email()),
  phone: createOptionalSchema(zod.string().length(10)),
  bio: createOptionalSchema(zod.string()),
  age: createOptionalSchema(zod.number().min(0).max(100)),
  isAlive: createOptionalSchema(zod.boolean()),
  favoriteColor: createOptionalSchema(zod.string()),
  startDate: createOptionalSchema(zod.date()),
});

export type Person = zod.infer<typeof personSchema>;

/**
 * Optional metadata for each field
 */
export const personMetas: Metas<Person> = {
  state: {
    size: 'sm',
  },
  zip: {
    subtype: 'zip',
    size: 'sm',
  },
  email: {
    subtype: 'email',
    helpText: "We won't share your email with anyone.",
  },
  phone: {
    subtype: 'phone',
  },
  bio: {
    multiline: true,
    size: 'lg',
  },
  age: {
    size: 'sm',
  },
  isAlive: {
    label: 'Are you alive?',
    trueStateLabel: 'Yes, I am currently alive',
    trueFalseLabels: ['Yep', 'Nope'],
    cellProps: (value) => ({
      bg: value === true ? 'green.50' : value === false ? 'red.50' : undefined,
    }),
  },
  favoriteColor: {
    label: 'Your aura',
    placeholder: 'Select a color',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
    ],
    size: 'sm',
  },
  startDate: {
    dateFormat: 'MM/dd/yyyy',
    size: 'sm',
  },
};

export const personFields = createFields(personSchema, personMetas);
export const personColumns = createColumns(personSchema, personMetas);
export const getPersonFields = createFieldsGetter(personFields);
export const getPersonColumns = createColumnsGetter(personColumns);

// TODO: consider making fields and columns into chainable objects
// fields.overrride(), fields.pick(), fields.omit().overrride(), etc.

// Example of how to pick fields and inject dynamic options
// (You could load options from an API in the parent component)
// const customizedFields = getPersonFields([
//   'lastName',
//   'firstName',
//   'favoriteColor',
// ]).map((field) => {
//   if (field.id === 'favoriteColor') {
//     return {
//       ...field,
//       options: [
//         ...(Array.isArray(field.options) ? field.options : []),
//         { label: 'Cyan', value: 'cyan' },
//         { label: 'Magenta', value: 'magenta' },
//         { label: 'Yellow', value: 'yellow' },
//       ],
//     };
//   }
//   return field;
// });
