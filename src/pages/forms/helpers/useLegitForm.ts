import * as reactHookForm from 'react-hook-form';

// Sets the default mode to onTouched
export function useLegitForm<
  TFieldValues extends reactHookForm.FieldValues = reactHookForm.FieldValues,
  TContext = any
>(...args: Parameters<typeof reactHookForm.useForm>) {
  return reactHookForm.useForm<TFieldValues, TContext>({
    mode: 'onTouched',
    ...args,
  });
}
