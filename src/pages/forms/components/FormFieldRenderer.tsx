import * as UI from '@chakra-ui/react';
import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from 'react-hook-form';

import { Field } from '../../../helpers/schemaHelpers';

export function FormFieldRenderer<
  TFieldValues extends FieldValues = FieldValues
>(props: {
  form: UseFormReturn<TFieldValues>;
  field: Field<TFieldValues>;
}): JSX.Element {
  const { form, field } = props;
  const id = field.id as Path<TFieldValues>; // gross
  const controller = useController({ name: id, control: form.control });

  if (field.type === 'boolean') {
    return (
      <UI.Box>
        <UI.Switch {...form.register(id)} />
      </UI.Box>
    );
  }

  if (field.type === 'number') {
    return (
      <UI.NumberInput
        placeholder={field.placeholder}
        {...controller.field}
        onChange={(str, num) => controller.field.onChange(num)}
      >
        <UI.NumberInputField />
        <UI.NumberInputStepper>
          <UI.NumberIncrementStepper />
          <UI.NumberDecrementStepper />
        </UI.NumberInputStepper>
      </UI.NumberInput>
    );
  }

  if (Array.isArray(field.options)) {
    if (field.options.length <= 3) {
      return (
        <UI.RadioGroup {...controller.field}>
          <UI.VStack alignItems="start">
            {field.options.map((option) => (
              <UI.Radio key={option.value} value={option.value}>
                {option.label}
              </UI.Radio>
            ))}
          </UI.VStack>
        </UI.RadioGroup>
      );
    }

    return (
      <UI.Select placeholder={field.placeholder || 'Choose one'}>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </UI.Select>
    );
  }

  return <UI.Input placeholder={field.placeholder} {...form.register(id)} />;
}
