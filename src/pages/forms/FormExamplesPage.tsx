import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { z } from 'zod';

import { createOptionalSchema } from '../../helpers/schemaHelpers';
import * as UI from './components/UI';

const personSchema = z.object({
  firstName: z.string().min(2),
  color: createOptionalSchema(z.string()),
  phone: z.string().min(10),
  email: z.string().email(),
  dob: z.date(),
  bio: z.string(),
  isAlive: createOptionalSchema(z.boolean()),
  isHappy: createOptionalSchema(z.boolean()),
});

type Person = z.infer<typeof personSchema>;

const FormExamplesPage: React.FC = () => {
  const form = UI.useHookForm<Person>({
    resolver: zodResolver(personSchema),
    defaultValues: {},
    onValid: (data) => {
      console.log('onValid', data);
      // This function can be async, and can throw errors to users.
    },
  });

  return (
    <UI.Box bg="white" p={4}>
      <UI.Form form={form}>
        <UI.FormField input={{ name: 'firstName' }} required />
        <UI.FormField
          input={{
            name: 'isAlive',
            type: 'boolean',
            label: 'I am still alive',
          }}
        />
        <UI.FormField
          input={{
            name: 'isHappy',
            type: 'boolean',
            label: 'I am a happy guy',
            control: 'switch',
          }}
        />
        <UI.FormField
          input={{
            name: 'color',
            options: [
              { label: 'Red', value: 'red' },
              { label: 'Green', value: 'green' },
              { label: 'Blue', value: 'blue' },
              { label: 'Yellow', value: 'yellow' },
            ],
          }}
        />
        <UI.FormField
          input={{
            name: 'color',
            options: [
              { label: 'Red', value: 'red' },
              { label: 'Green', value: 'green' },
              { label: 'Blue', value: 'blue' },
            ],
          }}
        />
        <UI.FormField input={{ name: 'phone', type: 'tel' }} required />
        <UI.FormField input={{ name: 'email', type: 'email' }} required />
        <UI.FormField
          label="D.O.B"
          input={{ name: 'dob', type: 'date' }}
          required
        />
        <UI.FormField required input={{ name: 'bio', multiline: true }} />
        <UI.FormErrorMessage>{form.formState.error}</UI.FormErrorMessage>
        <UI.FormButtonStack>
          <UI.SubmitButton>Save</UI.SubmitButton>
        </UI.FormButtonStack>
      </UI.Form>
    </UI.Box>
  );
};

export default FormExamplesPage;
