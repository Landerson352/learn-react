import React from 'react';
import _ from 'lodash';

import { LegitFormReturn } from '../helpers/useLegitForm';
import { FormProvider } from 'react-hook-form';

export const FormContainer: React.FC<
  React.PropsWithChildren<{ form: LegitFormReturn<any> }>
> = ({ form, children }) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    formState: { errors },
  } = form;

  // When errors is not empty, focus on the first invald element
  React.useEffect(() => {
    if (formRef.current && _.isEmpty(errors)) {
      const firstInvalidElement = formRef.current.querySelector(
        '[aria-invalid="false"]'
      );
      if (firstInvalidElement) {
        (firstInvalidElement as HTMLElement).focus();
      }
    }
  }, [errors]);

  return (
    <FormProvider {...form}>
      <form ref={formRef} onSubmit={form.onSubmit}>
        <fieldset disabled={form.formState.isSubmitting}>{children}</fieldset>
      </form>
    </FormProvider>
  );
};
