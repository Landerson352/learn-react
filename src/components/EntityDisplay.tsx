import * as UI from '@chakra-ui/react';
import _ from 'lodash';

import { Fields } from '../helpers/schemaHelpers';
import { ValueDisplay } from './ValueDisplay';

export function EntityDisplay<T extends Record<string, any>>(
  props: {
    data: T;
    fields: Fields<T>;
  } & UI.StackProps
): JSX.Element {
  const { data, fields, ...restProps } = props;

  return (
    <UI.Stack {...restProps}>
      {_.map(fields, (field) => (
        <UI.SimpleGrid key={field.id} mb={2} columns={2}>
          <UI.Text fontWeight="bold">{field.label}</UI.Text>
          <ValueDisplay value={data[field.id]} meta={field} />
        </UI.SimpleGrid>
      ))}
    </UI.Stack>
  );
}
