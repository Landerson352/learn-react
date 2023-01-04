import * as UI from '@chakra-ui/react';
import { Path, UseFormReturn } from 'react-hook-form';

import { formatError } from '../helpers/formatError';
import { Fields } from '../../../helpers/schemaHelpers';

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
    <UI.Stack spacing={4} alignItems="start" {...restProps}>
      {fields.map((field) => {
        const id = field.id as Path<T>; // gross
        return (
          <UI.FormControl key={id} isInvalid={!!errors[id]}>
            <UI.FormLabel htmlFor={id}>{field.label}</UI.FormLabel>
            {field.type === 'boolean' ? (
              <UI.Box>
                <UI.Switch {...form.register(id)} />
              </UI.Box>
            ) : null}
            {field.type === 'text' ? <UI.Input {...form.register(id)} /> : null}
            {field.type === 'number' ? (
              <UI.NumberInput>
                <UI.NumberInputField />
                <UI.NumberInputStepper>
                  <UI.NumberIncrementStepper />
                  <UI.NumberDecrementStepper />
                </UI.NumberInputStepper>
              </UI.NumberInput>
            ) : null}
            {field.helpText ? (
              <UI.FormHelperText>{field.helpText}</UI.FormHelperText>
            ) : null}
            <UI.FormErrorMessage>{formatError(errors[id])}</UI.FormErrorMessage>
            {/* <UI.Code colorScheme="purple" px={3} py={2} my={2}>
                {JSON.stringify(field)}
              </UI.Code> */}
          </UI.FormControl>
        );
      })}
    </UI.Stack>
  );
}
