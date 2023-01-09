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
    size: 'lg',
  },
  age: {
    size: 'sm',
  },
  favoriteColor: {
    label: 'Your aura', // label override
    placeholder: 'Select a color',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
    ],
  },
  isAlive: {
    label: 'Are you alive?', // label override
    trueStateLabel: 'Yes, I am currently alive and not dead',
    size: 'lg',
  },
  bio: {
    multiline: true,
    size: 'lg',
  },
  state: {
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
// (You could load optins from an API in the parent component)
const customizedFields = getPersonFields([
  'lastName',
  'firstName',
  'favoriteColor',
]).map((field) => {
  if (field.id === 'favoriteColor') {
    return {
      ...field,
      options: [
        ...(Array.isArray(field.options) ? field.options : []),
        { label: 'Cyan', value: 'cyan' },
        { label: 'Magenta', value: 'magenta' },
        { label: 'Yellow', value: 'yellow' },
      ],
    };
  }
  return field;
});
