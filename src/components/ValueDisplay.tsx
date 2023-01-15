import * as UI from '@chakra-ui/react';
import { format } from 'date-fns';
import _ from 'lodash';

import { Meta } from '../helpers/schemaHelpers';

export function ValueDisplay<T>({
  value,
  meta,
}: {
  value: any;
  meta?: Meta<T>;
}) {
  // Print a muted emdash for null or empty values
  if (_.isNil(value) || String(value).trim() === '') {
    return <UI.Text color="gray.400">—</UI.Text>;
  }

  // Use the label for the value if it's an enum, or the formatter if it's a function
  let formattedValue =
    _.find(meta?.options, { value })?.label ||
    (meta?.format ? meta?.format(value) : String(value));

  if (meta?.type === 'boolean') {
    // Default formatter for booleans
    if (!meta.format) {
      const labels = meta.trueFalseLabels || ['Yes', 'No'];
      formattedValue = value ? labels[0] : labels[1];
    }

    return (
      <UI.Text fontWeight="bold" color={value ? 'green.500' : 'red.500'}>
        {formattedValue}
      </UI.Text>
    );
  }

  if (meta?.type === 'date') {
    // Default formatter for dates
    if (!meta.format) {
      formattedValue = format(value, meta.dateFormat || 'yyyy-MM-dd');
    }
    return <UI.Text>{formattedValue}</UI.Text>;
  }

  if (meta?.subtype === 'email') {
    return (
      <UI.Link href={`mailto:${value}`} target="_blank">
        {formattedValue}
      </UI.Link>
    );
  }

  if (meta?.subtype === 'phone') {
    return (
      <UI.Link href={`tel://${value}`} target="_blank">
        {formattedValue}
      </UI.Link>
    );
  }

  return <UI.Text>{formattedValue}</UI.Text>;
}
