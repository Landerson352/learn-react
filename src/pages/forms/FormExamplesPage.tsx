import * as UI from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

const FormExamplesPage: React.FC = () => {
  const form = useForm();

  return (
    <UI.Box p={4} bg="white">
      <form onSubmit={form.handleSubmit(console.log)}>...</form>
    </UI.Box>
  );
};

export default FormExamplesPage;
