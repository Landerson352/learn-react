import * as UI from '@chakra-ui/react';
import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from 'react-hook-form';

import { Field } from '../../../helpers/schemaHelpers';
import { MaskedInput } from './MaskedInput';

export function FormFieldRenderer<
  TFieldValues extends FieldValues = FieldValues
>(props: {
  form: UseFormReturn<TFieldValues>;
  field: Field<TFieldValues>;
}): JSX.Element {
  const { form, field } = props;
  const id = field.id as Path<TFieldValues>; // gross
  const controller = useController({ name: id, control: form.control });

  // Switch control
  if (field.type === 'boolean' && field.control === 'switch') {
    return (
      <UI.HStack spacing={3} alignItems="start" py={2}>
        <UI.Switch my="1px" {...form.register(id)} />
        <UI.Text fontSize="sm">{field.trueStateLabel}</UI.Text>
      </UI.HStack>
    );
  }

  // Checkbox control
  if (field.type === 'boolean') {
    return (
      <UI.Box py={2}>
        <UI.Checkbox size="lg" my="1px" {...form.register(id)}>
          <UI.Text fontSize="sm">{field.trueStateLabel}</UI.Text>
        </UI.Checkbox>
      </UI.Box>
    );
  }

  // Numeric control
  if (field.type === 'number') {
    return (
      <UI.NumberInput
        placeholder={field.placeholder}
        {...controller.field}
        onChange={(str, num) => controller.field.onChange(num)}
        isDisabled={form.formState.isSubmitting}
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
    // Radio control
    if (field.options.length <= 3) {
      return (
        <UI.RadioGroup {...controller.field} size="sm">
          <UI.VStack alignItems="start" spacing={1}>
            {field.options.map((option) => (
              <UI.Radio key={option.value} value={option.value}>
                {option.label}
              </UI.Radio>
            ))}
          </UI.VStack>
        </UI.RadioGroup>
      );
    }

    // Select control
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

  // Textarea control
  if (field.multiline) {
    return (
      <UI.Textarea placeholder={field.placeholder} {...form.register(id)} />
    );
  }

  // Masked input
  if (field.mask) {
    return (
      <MaskedInput
        maskGenerator={field.mask}
        placeholder={field.placeholder}
        {...controller.field}
      />
    );
  }

  // Text control
  return <UI.Input placeholder={field.placeholder} {...form.register(id)} />;
}
