import * as UI from '@chakra-ui/react';
import {
  faCircleExclamation,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { AsyncProps, AsyncSelect } from 'chakra-react-select';
import {
  CurrencyInputProps,
  removeNonNumericsExceptDash,
  useCurrencyFormat,
} from 'input-currency-react';
import _ from 'lodash';
import React from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useController,
  useForm,
  useFormContext,
  UseFormProps,
} from 'react-hook-form';
import { MaskedInput as RHMMaskedInput, useWebMask } from 'react-hook-mask';
import { NumericFormat } from 'react-number-format';

import { subtypeMetas } from '../../../helpers/subtypeMetas';
import { formatError } from '../helpers/formatError';

export * from '@chakra-ui/react';

export type UseHookFormReturn<TFieldValues extends FieldValues = FieldValues> =
  ReturnType<typeof useHookForm<TFieldValues, any>>;

export function useHookForm<
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

/* Creates a form-context-provider,and renders a form element and form-grid with children */
export function Form<TFieldValues extends FieldValues = FieldValues>(
  props: FormGridProps & {
    form: UseHookFormReturn<TFieldValues>;
  }
): JSX.Element {
  const { form, ...restProps } = props;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.onSubmit}>
        <FormGrid {...restProps} />
      </form>
    </FormProvider>
  );
}

/* Renders a simple-grid with children */
export type FormGridProps = UI.SimpleGridProps;
export const FormGrid: React.FC<FormGridProps> = ({ ...restProps }) => {
  return <UI.SimpleGrid spacingX={4} spacingY={2} {...restProps} />;
};

/* Renders a form-control-display wrapper with dynamic form-input */
/* Must be placed inside a form-context-provider */
export type FormFieldProps = Omit<FullFormControlProps, 'name'> & {
  input: FormInputProps;
};
export const FormField: React.FC<FormFieldProps> = ({
  input,
  ...restProps
}) => {
  // Pull error out of formState
  const form = useFormContext();
  const errors = form.formState.errors[input.name];
  const fallbackLabel = _.capitalize(_.lowerCase(input.name));

  return (
    <FullFormControl
      {...restProps}
      name={input.name}
      label={restProps.label || fallbackLabel}
      isInvalid={!!errors}
      errorMessage={formatError(errors)}
    >
      <FormInput {...input} />
    </FullFormControl>
  );
};

/* Renders a more styled form error, with persistent height to mitigate layout shift */
export const FormFieldErrorMessage: React.FC<UI.BoxProps> = ({
  children,
  ...restProps
}) => {
  return (
    <UI.Box minH={5} mt={1} {...restProps}>
      <UI.FormErrorMessage mt={0}>
        <UI.HStack spacing={1} alignItems="start">
          <UI.Text lineHeight={5}>
            <FontAwesomeIcon icon={faExclamationCircle} />
          </UI.Text>
          <UI.Text>{children}</UI.Text>
        </UI.HStack>
      </UI.FormErrorMessage>
    </UI.Box>
  );
};

/* Renders a form-control, label, helper-text, children, and error message */
export type FullFormControlProps = UI.FormControlProps & {
  label?: string;
  required?: boolean;
  name: string;
  helperText?: string;
  errorMessage?: string;
};
export const FullFormControl: React.FC<FullFormControlProps> = ({
  label,
  required,
  name,
  children,
  helperText,
  errorMessage,
  ...restProps
}) => {
  return (
    <UI.FormControl {...restProps}>
      {label ? (
        <UI.FormLabel htmlFor={name}>
          {label}{' '}
          {required ? (
            <UI.Text as="span" color="red.500">
              *
            </UI.Text>
          ) : null}
        </UI.FormLabel>
      ) : null}
      {children}
      {helperText ? <UI.FormHelperText>{helperText}</UI.FormHelperText> : null}
      <FormFieldErrorMessage>{errorMessage}</FormFieldErrorMessage>
    </UI.FormControl>
  );
};

/* Renders a different input depending on type */
/* Must be placed inside a form-context-provider */
export type FormInputProps = {
  name: string;
  type?:
    | 'boolean'
    | 'date'
    | 'email'
    | 'money'
    | 'number'
    | 'password'
    | 'phone'
    | 'text';
  format?: string;
  multiline?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  control?: 'radio' | 'select' | 'checkbox' | 'switch';
  label?: string;
  loadOptions?: AsyncProps<any, any, any>['loadOptions'];
};
export const FormInput: React.FC<FormInputProps> = ({
  name,
  type,
  format = 'MM/dd/yyyy',
  multiline,
  placeholder,
  options,
  control,
  label,
  loadOptions,
}) => {
  const form = useFormContext();
  const controller = useController({ name, control: form.control });

  // Money control
  if (type === 'money') {
    return (
      <MoneyInput
        value={controller.field.value}
        onChange={controller.field.onChange}
      />
    );
  }

  // Switch control
  if (type === 'boolean' && control === 'switch') {
    return (
      <UI.HStack spacing={3} alignItems="start" py={2}>
        <UI.Switch my="1px" {...form.register(name)} />
        <UI.Text fontSize="sm">{label}</UI.Text>
      </UI.HStack>
    );
  }

  // Checkbox control (default)
  if (type === 'boolean') {
    return (
      <UI.Box py={2}>
        <UI.Checkbox size="lg" my="1px" {...form.register(name)}>
          <UI.Text fontSize="sm">{label}</UI.Text>
        </UI.Checkbox>
      </UI.Box>
    );
  }

  // Datepicker control
  if (type === 'date') {
    return (
      <SingleDatepicker
        name={controller.field.name}
        date={controller.field.value}
        onDateChange={controller.field.onChange}
        propsConfigs={{
          inputProps: {
            cursor: 'pointer',
            // isReadOnly: true,
          },
        }}
        configs={{
          dateFormat: format,
        }}
      />
    );
  }

  // Async select control
  if (loadOptions) {
    return (
      <AsyncSelect
        name={controller.field.name}
        value={controller.field.value}
        onChange={(value) => {
          console.log(value);
          controller.field.onChange(value);
        }}
        placeholder={placeholder}
        loadOptions={loadOptions}
        defaultOptions
        cacheOptions
        isClearable
        openMenuOnFocus={false}
        openMenuOnClick={false}
      />
    );
  }

  if (Array.isArray(options)) {
    // Radio control
    if ((options.length <= 3 || control === 'radio') && control !== 'select') {
      return (
        <UI.RadioGroup {...controller.field} size="sm">
          <UI.VStack alignItems="start" spacing={1}>
            {options.map((option) => (
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
      <UI.Select
        {...controller.field}
        placeholder={placeholder || 'Choose one'}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </UI.Select>
    );
  }

  if (type === 'number') {
    return (
      <NumericFormat
        value={parseFloat(controller.field.value ?? 0)}
        onValueChange={(values) => controller.field.onChange(values.floatValue)}
        thousandSeparator=","
        customInput={UI.Input}
        suffix="%"
      />
    );
  }

  // Textarea control
  if (multiline) {
    return (
      <UI.Textarea
        id={name}
        {...controller.field}
        value={controller.field.value ?? ''}
        placeholder={placeholder}
      />
    );
  }

  // Masked input control
  let mask;
  if (type === 'phone') {
    mask = subtypeMetas.phone.mask;
  }

  if (mask) {
    return (
      <MaskedInput
        id={name}
        maskGenerator={mask}
        {...controller.field}
        value={controller.field.value ?? ''}
        placeholder={placeholder}
      />
    );
  }

  // Text input control
  return (
    <TextInput
      id={name}
      type={type}
      {...controller.field}
      value={controller.field.value ?? ''}
      placeholder={placeholder}
    />
  );
};

export type TextInputProps = UI.InputProps;
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ ...restProps }, ref) => {
    return <UI.Input ref={ref} data-lpignore="true" {...restProps} />;
  }
);

export const MaskedInput = React.forwardRef<
  HTMLInputElement,
  Parameters<typeof RHMMaskedInput>[0] & UI.InputProps
>(({ value = '', onChange, maskGenerator, keepMask, ...restProps }, ref) => {
  const webMask = useWebMask({
    value,
    onChange,
    maskGenerator,
    keepMask,
    ref,
  });

  return <TextInput {...restProps} {...webMask} />;
});

export type MoneyInputProps = Omit<UI.InputProps, 'value'> & {
  options?: CurrencyInputProps['options'];
  value: number | undefined;
  onChange(value: number | undefined): any;
};
export const MoneyInput: React.FC<MoneyInputProps> = (props) => {
  const { value, options, onChange, ...otherProps } = props;
  const stringValue = String(value);
  // console.log('stringValue', stringValue);

  const [formattedValue, handleOnChange, handleOnKeyDown, handleOnClick] =
    useCurrencyFormat(stringValue, {
      locale: 'en-US',
      i18nCurrency: 'USD',
      ...options,
      onChangeCallBack: (_, maskedValue, value) => {
        const intValue = parseInt(removeNonNumericsExceptDash(value));
        // console.log('intValue', intValue);
        onChange?.(intValue);
      },
    });

  return (
    <UI.Input
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      onClick={handleOnClick}
      value={formattedValue}
      {...otherProps}
    />
  );
};

export const FormErrorMessage: React.FC<
  React.PropsWithChildren<UI.AlertProps>
> = ({ children, ...restProps }) => {
  if (!children) return null;

  return (
    <UI.Alert colorScheme="red" borderRadius="lg" {...restProps}>
      <UI.HStack alignItems="start">
        <UI.Text color="red.500" fontSize="xl" lineHeight={6}>
          <FontAwesomeIcon icon={faCircleExclamation} />
        </UI.Text>
        <UI.AlertTitle>{children}</UI.AlertTitle>
      </UI.HStack>
    </UI.Alert>
  );
};

export const FormButtonStack: React.FC<UI.StackProps> = ({
  children,
  ...restProps
}) => {
  return (
    <UI.HStack spacing={4} {...restProps}>
      {children}
    </UI.HStack>
  );
};

/* Must be placed inside a form-context-provider */
export const SubmitButton: React.FC<UI.ButtonProps> = ({
  children,
  ...restProps
}) => {
  const form = useFormContext();

  return (
    <UI.Button
      type="submit"
      colorScheme="purple"
      isDisabled={form.formState.isSubmitting}
      {...restProps}
    >
      {children}
    </UI.Button>
  );
};

export const LinkButton: React.FC<UI.ButtonProps> = ({
  children,
  ...restProps
}) => {
  return (
    <UI.Button variant="link" {...restProps}>
      {children}
    </UI.Button>
  );
};
