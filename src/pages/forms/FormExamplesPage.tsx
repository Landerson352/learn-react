import React from 'react';
import * as UI from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';

import { useLegitForm } from './helpers/useLegitForm';
import { Form } from './components/Form';
import { Person, personSchema, personFields } from '../data-grid/person/schema';
import { delay } from '../../helpers/delay';

// Example of how to add dynamic options into fields
// You could load this from an API in the parent component
const customizedFields = personFields.map((field) => {
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

const FormExamplesPage: React.FC = () => {
  const form = useLegitForm<Person>({
    resolver: zodResolver(personSchema),
    onValid: async (data) => {
      console.log('onValid', data);
      // Simulate a failed network request
      await delay(1000);
      throw new Error('Sorry, something went wrong.');
    },
    onInvalid: (errors) => {
      console.log('onInvalid', errors);
    },
  });

  return (
    <UI.Box p={4} bg="white">
      <Form.Container form={form}>
        <UI.Heading mb={4}>Add person</UI.Heading>
        <Form.FieldsRenderer form={form} fields={personFields} />
        <Form.Error mb={4}>{form.formState.error}</Form.Error>
        <Form.SubmitButton isDisabled={form.formState.isSubmitting}>
          Save
        </Form.SubmitButton>
      </Form.Container>
    </UI.Box>
  );
};

export default FormExamplesPage;
