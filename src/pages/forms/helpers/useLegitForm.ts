import _ from 'lodash';
import React from 'react';
import {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
} from 'react-hook-form';

export type LegitFormReturn<TFieldValues extends FieldValues = FieldValues> =
  ReturnType<typeof useLegitForm<TFieldValues, any>>;

export function useLegitForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseFormProps<TFieldValues, TContext> & {
    onValid?: SubmitHandler<TFieldValues>;
    onInvalid?: SubmitErrorHandler<TFieldValues>;
  }
) {
  const { onInvalid, onValid, ...restProps } = props;
  const form = useForm<TFieldValues, TContext>({
    mode: 'onTouched',
    ...restProps,
  });
  const [error, setError] = React.useState<string>();

  const handleValid: SubmitHandler<TFieldValues> = async (data) => {
    // console.log('handleValid', data);
    try {
      setError(undefined);
      await onValid?.(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleInvalid: SubmitErrorHandler<TFieldValues> = async (errors) => {
    // console.log('handleInvalid', errors);
    try {
      setError(undefined);
      await onInvalid?.(errors);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const onSubmit = form.handleSubmit(handleValid, handleInvalid);

  return _.merge(form, { onSubmit, formState: { error } });
}
