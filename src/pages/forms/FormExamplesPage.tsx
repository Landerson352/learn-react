import * as UI from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';

import { delay } from '../../helpers/delay';
import { Person, personFields, personSchema } from '../data-grid/person/schema';
import { Form } from './components/Form';
import { useLegitForm } from './helpers/useLegitForm';

const FormExamplesPage: React.FC = () => {
  const form = useLegitForm<Person>({
    resolver: zodResolver(personSchema),
    onValid: async (data) => {
      console.log('onValid', data);
      // Simulate a failed network request
      await delay(3000);
      throw new Error('Sorry, something went wrong. Please try again.');
    },
    onInvalid: (errors) => {
      console.log('onInvalid', errors);
    },
  });

  return (
    <UI.Box p={4} bg="white">
      <Form.Container form={form}>
        <UI.Heading mb={4}>Add person</UI.Heading>
        <Form.FieldsRenderer form={form} fields={personFields} maxW="550px" />
        <Form.Error mb={4}>{form.formState.error}</Form.Error>
        <Form.SubmitButton isDisabled={form.formState.isSubmitting}>
          Save
        </Form.SubmitButton>
      </Form.Container>
    </UI.Box>
  );
};

export default FormExamplesPage;
