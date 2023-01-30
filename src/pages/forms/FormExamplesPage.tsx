import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { z } from 'zod';

import { createOptionalSchema } from '../../helpers/schemaHelpers';
import { findUsStatesFromSearchtring } from '../../helpers/usStates';
import * as UI from './components/UI';

const personSchema = z.object({
  firstName: z.string().min(2),
  color: createOptionalSchema(z.string()),
  phone: z.string().min(10),
  email: z.string().email(),
  dob: z.date(),
  bio: z.string().min(1),
  isAlive: z.literal(true, {
    errorMap: () => ({ message: 'You must be alive to submit this form' }),
  }),
  isHappy: createOptionalSchema(z.boolean()),
  price: z.number(),
  state: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { invalid_type_error: 'Required' }
  ),
  percent: z.number(),
});

type Person = z.infer<typeof personSchema>;

const FormExamplesPage: React.FC = () => {
  const form = UI.useHookForm<Person>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      // example of default value for autocomplete
      state: { value: 'FL', label: 'Florida' },
    },
    onValid: (data) => {
      console.log('onValid', data);
      // This function can be async, and can throw errors to users.
    },
  });

  return (
    <UI.Box bg="white" p={4}>
      <UI.Form form={form}>
        <UI.FormGrid>
          <UI.FormField name="firstName" requiredStyling />
          <UI.FormField
            name="percent"
            input={{ type: 'number', config: { suffix: '%' } }}
            requiredStyling
            span="sm"
          />
          <UI.FormField
            name="price"
            input={{ type: 'money' }}
            requiredStyling
            span="sm"
          />
          <UI.FormField
            name="isAlive"
            input={{
              type: 'boolean',
              label: 'I am still alive',
            }}
          />
          <UI.FormField
            name="isHappy"
            input={{
              type: 'boolean',
              label: 'I am a happy guy',
              control: 'switch',
            }}
          />
          <UI.FormField
            name="dob"
            label="D.O.B"
            input={{ type: 'date' }}
            requiredStyling
            span="sm"
          />
          <UI.FormField
            name="color"
            input={{
              type: 'options',
              options: [
                { label: 'Red', value: 'red' },
                { label: 'Green', value: 'green' },
                { label: 'Blue', value: 'blue' },
                { label: 'Yellow', value: 'yellow' },
              ],
            }}
          />
          <UI.FormField
            name="color"
            input={{
              type: 'options',
              options: [
                { label: 'Red', value: 'red' },
                { label: 'Green', value: 'green' },
                { label: 'Blue', value: 'blue' },
              ],
            }}
            span="sm"
          />
          <UI.FormField
            name="state"
            input={{
              type: 'options',
              options: (inputValue, callback) => {
                callback(findUsStatesFromSearchtring(inputValue));
              },
            }}
          />
          <UI.FormField
            name="phone"
            input={{ type: 'phone' }}
            requiredStyling
          />
          <UI.FormField
            name="email"
            input={{ type: 'email' }}
            requiredStyling
          />
          <UI.FormField
            name="bio"
            input={{ multiline: true }}
            requiredStyling
            span="lg"
          />
          <UI.FormErrorMessage>{form.formState.error}</UI.FormErrorMessage>
          <UI.FormButtonStack>
            <UI.SubmitButton>Save</UI.SubmitButton>
          </UI.FormButtonStack>
        </UI.FormGrid>
      </UI.Form>
    </UI.Box>
  );
};

export default FormExamplesPage;
