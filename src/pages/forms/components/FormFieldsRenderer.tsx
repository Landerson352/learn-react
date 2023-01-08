import * as UI from '@chakra-ui/react';
import { Path, UseFormReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { formatError } from '../helpers/formatError';
import { Fields } from '../../../helpers/schemaHelpers';
import { FormFieldRenderer } from './FormFieldRenderer';

export function FormFieldsRenderer<T extends Record<string, any>>(
  props: {
    form: UseFormReturn<T>;
    fields: Fields<T>;
  } & UI.StackProps
): JSX.Element {
  const { form, fields, ...restProps } = props;
  const {
    formState: { errors },
  } = form;

  return (
    <UI.Stack spacing={0} alignItems="start" {...restProps}>
      {fields.map((field) => {
        const id = field.id as Path<T>; // gross
        return (
          <UI.FormControl key={id} isInvalid={!!errors[id]}>
            <UI.FormLabel htmlFor={id} mb={1}>
              {field.label}
            </UI.FormLabel>
            <FormFieldRenderer form={form} field={field} />
            {field.helpText ? (
              <UI.FormHelperText>{field.helpText}</UI.FormHelperText>
            ) : null}
            <UI.Box minH={5} mt={1}>
              {/* This container mitigates layout shift during validation. */}
              <UI.FormErrorMessage mt={0}>
                <UI.HStack spacing={1}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <UI.Text>{formatError(errors[id])}</UI.Text>
                </UI.HStack>
              </UI.FormErrorMessage>
            </UI.Box>
            {/* <UI.Code colorScheme="purple" px={3} py={2} my={2}>
                {JSON.stringify(field)}
              </UI.Code> */}
          </UI.FormControl>
        );
      })}
    </UI.Stack>
  );
}
