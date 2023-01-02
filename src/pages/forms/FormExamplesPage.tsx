import React from 'react';
import * as UI from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as reactHookForm from 'react-hook-form';

import { Person, personSchema } from '../data-grid/person/schema';

const FormExamplesPage: React.FC = () => {
  const form = reactHookForm.useForm<Person>({
    mode: 'onTouched',
    resolver: zodResolver(personSchema.validator),
  });

  return (
    <UI.Box p={4}>
      {personSchema.columns.map((column) => {
        // gross
        const key = column.id as keyof typeof personSchema.validator.shape;
        // const validator = personSchema.validator.shape[key];
        // console.log(validator);
        return <UI.Box key={key}>{column.id}</UI.Box>;
      })}
    </UI.Box>
  );
};

export default FormExamplesPage;
