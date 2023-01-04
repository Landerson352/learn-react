import React from 'react';
import * as UI from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLegitForm } from './helpers/useLegitForm';
import { Person, personSchema, personFields } from '../data-grid/person/schema';

const FormExamplesPage: React.FC = () => {
  const form = useLegitForm<Person>({
    resolver: zodResolver(personSchema),
  });

  return (
    <UI.Box p={4}>
      {/* TODO: move into FormRenderer component */}
      {personFields.map((field) => {
        // const meta = column.meta as Field<Person>;
        return (
          <UI.Box key={field.id}>
            {field.label} : {JSON.stringify(field)}
          </UI.Box>
        );
      })}
    </UI.Box>
  );
};

export default FormExamplesPage;
