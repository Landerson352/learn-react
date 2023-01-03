import React from 'react';
import * as UI from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLegitForm } from './helpers/useLegitForm';
import { Person, personSchema } from '../data-grid/person/schema';
import { ColumnMeta } from '../data-grid/helpers/createColumnGetter';

const FormExamplesPage: React.FC = () => {
  const form = useLegitForm<Person>({
    resolver: zodResolver(personSchema.validator),
  });

  return (
    <UI.Box p={4}>
      {/* TODO: move into FormRenderer component */}
      {personSchema.columns.map((column) => {
        // const key = column.id;// as keyof Person;
        // const validator = personSchema.validator.shape[key];
        const meta = column.meta as ColumnMeta<Person>;
        return (
          <UI.Box key={column.id}>
            {meta.label} : {JSON.stringify(meta)}
          </UI.Box>
        );
      })}
    </UI.Box>
  );
};

export default FormExamplesPage;
