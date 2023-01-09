import * as UI from '@chakra-ui/react';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Path, UseFormReturn } from 'react-hook-form';

import { Fields } from '../../../helpers/schemaHelpers';
import { formatError } from '../helpers/formatError';
import { FormFieldRenderer } from './FormFieldRenderer';

export function FormFieldsRenderer<T extends Record<string, any>>(
  props: {
    form: UseFormReturn<T>;
    fields: Fields<T>;
  } & UI.SimpleGridProps
): JSX.Element {
  const { form, fields, ...restProps } = props;
  const {
    formState: { errors },
  } = form;

  const columns = UI.useBreakpointValue([1, 4]) || 1;

  return (
    <UI.SimpleGrid columns={columns} spacingX={4} spacingY={2} {...restProps}>
      {fields.map((field) => {
        const id = field.id as Path<T>; // gross
        const spanValue = Math.min(
          columns,
          {
            sm: 1,
            md: 2,
            lg: 4,
          }[field.size || 'md']
        );

        return (
          <UI.FormControl
            key={id}
            isInvalid={!!errors[id]}
            gridColumn={`span ${spanValue}`}
          >
            <UI.FormLabel htmlFor={id}>{field.label}</UI.FormLabel>
            <FormFieldRenderer form={form} field={field} />
            {field.helpText ? (
              <UI.FormHelperText>{field.helpText}</UI.FormHelperText>
            ) : null}
            <UI.Box minH={5} mt={1}>
              {/* This container mitigates layout shift during validation. */}
              <UI.FormErrorMessage mt={0}>
                <UI.HStack spacing={1} alignItems="start">
                  <UI.Text lineHeight={5}>
                    <FontAwesomeIcon icon={faExclamationCircle} />
                  </UI.Text>
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
    </UI.SimpleGrid>
  );
}
