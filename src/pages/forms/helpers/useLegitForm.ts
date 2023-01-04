import { FieldValues, UseFormProps, useForm } from 'react-hook-form';

export function useLegitForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(props?: UseFormProps<TFieldValues, TContext>) {
  return useForm<TFieldValues, TContext>({
    mode: 'onTouched',
    ...props,
  });
}
