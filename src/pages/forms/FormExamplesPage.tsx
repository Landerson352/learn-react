import React from 'react';
import * as UI from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

import { Person, personSchema, personFields } from '../data-grid/person/schema';
import { FormFieldsRenderer } from './components/FormFieldsRenderer';

const FormExamplesPage: React.FC = () => {
  const form = useForm<Person>({
    mode: 'onTouched',
    resolver: zodResolver(personSchema),
  });

  const onValid: SubmitHandler<Person> = (data) => {
    console.log('onValid', data);
  };

  const onInvalid: SubmitErrorHandler<Person> = (errors) => {
    console.log('onInvalid', errors);
  };

  return (
    <UI.Box p={4} bg="white">
      <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
        <FormFieldsRenderer form={form} fields={personFields} mb={4} />
        <UI.Button type="submit">Submit</UI.Button>
      </form>
    </UI.Box>
  );
};

export default FormExamplesPage;
