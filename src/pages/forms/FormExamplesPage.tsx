import * as UI from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import React from 'react';

import { ValueDisplay } from '../../components/ValueDisplay';
import { delay } from '../../helpers/delay';
import { Person, personFields, personSchema } from '../data-grid/person/schema';
import { Form } from './components/Form';
import { useLegitForm } from './helpers/useLegitForm';

const FormExamplesPage: React.FC = () => {
  const form = useLegitForm<Person>({
    defaultValues: {
      // zip: '12345',
      // email: 'demo@demo.com',
      // phone: '1234567890',
      zip: null,
      email: null,
      phone: null,
    },
    resolver: zodResolver(personSchema),
    onValid: async (data) => {
      console.log('onValid', data);
      // WIP:
      console.log('parse', personSchema.parse(data));
      // Simulate a failed network request
      await delay(3000);
      throw new Error('Sorry, something went wrong. Please try again.');
    },
    onInvalid: (errors) => {
      console.log('onInvalid', errors);
    },
  });
  const formData = form.watch();

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

      <UI.Box mt={8}>
        <UI.Heading mb={4}>Form state</UI.Heading>
        {/* TODO: Create EntityRenderer component React.FC<{ fields, data }> */}
        {_.map(personFields, (field) => (
          <UI.SimpleGrid key={field.id} mb={2} columns={2}>
            <UI.Text fontWeight="bold">{field.label}</UI.Text>
            <ValueDisplay value={formData[field.id]} meta={field} />
          </UI.SimpleGrid>
        ))}
      </UI.Box>
    </UI.Box>
  );
};

export default FormExamplesPage;
