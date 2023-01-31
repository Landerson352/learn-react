import * as UI from '@chakra-ui/react';
import {
  faCircleExclamation,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatepickerConfigs, SingleDatepicker } from 'chakra-dayzed-datepicker';
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
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { useMeasure } from 'react-use';

import { subtypeMetas } from '../../../helpers/subtypeMetas';
import { formatError } from '../helpers/formatError';
import { CameraInput } from './CameraInput';

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
  props: React.PropsWithChildren<{
    form: UseHookFormReturn<TFieldValues>;
  }>
): JSX.Element {
  const { form, children } = props;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.onSubmit}>{children}</form>
    </FormProvider>
  );
}

/* Context primarily for accessing column count from cells */
const FormGridContext = React.createContext<
  FormGridProps & { columns?: number }
>({});
const useFormGridContext = () => React.useContext(FormGridContext);

/* Renders a simple-grid with children */
export type FormGridProps = Omit<UI.SimpleGridProps, 'columns'>;
export const FormGrid: React.FC<FormGridProps> = ({ ...restProps }) => {
  const [measureRef, { width }] = useMeasure<HTMLDivElement>();

  let columns = 1;
  if (width > 260) {
    columns = 2;
  }
  if (width > 260 * 2) {
    columns = 4;
  }
  if (width > 260 * 4) {
    columns = 8;
  }

  const gridProps = {
    ref: measureRef,
    columns: columns,
    spacingX: 4,
    spacingY: 2,
    ...restProps,
  };
  return (
    <FormGridContext.Provider value={gridProps}>
      <UI.SimpleGrid {...gridProps} />
    </FormGridContext.Provider>
  );
};

/* Renders a form-control-display wrapper with dynamic form-input */
/* Must be placed inside a form-context-provider */
export type FormFieldProps = FullFormControlProps & {
  input?: FormInputByTypeProps;
};
export const FormField: React.FC<FormFieldProps> = ({
  name,
  input,
  ...restProps
}) => {
  // Pull error out of formState
  const form = useFormContext();
  const errors = form.formState.errors[name];
  const fallbackLabel = _.capitalize(_.lowerCase(name));

  return (
    <FullFormControl
      {...restProps}
      name={name}
      label={restProps.label || fallbackLabel}
      isInvalid={!!errors}
      errorMessage={formatError(errors)}
    >
      <FormInput name={name} {...input} />
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
/* Must be placed inside a form-grid-context-provider */
export type FullFormControlProps = UI.FormControlProps & {
  label?: string;
  requiredStyling?: boolean;
  name: string;
  helperText?: string;
  errorMessage?: string;
  span?: 'sm' | 'md' | 'lg';
};
export const FullFormControl: React.FC<FullFormControlProps> = ({
  label,
  requiredStyling: required,
  name,
  children,
  helperText,
  errorMessage,
  span = 'md',
  ...restProps
}) => {
  const gridProps = useFormGridContext();
  const spanColumns = Math.min(
    {
      sm: 1,
      md: 2,
      lg: 4,
    }[span],
    gridProps.columns || 1
  );

  return (
    <UI.FormControl gridColumn={`span ${spanColumns}`} {...restProps}>
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
export type FormInputByTypeProps =
  | {
      type: 'boolean';
      label?: string;
      control?: 'checkbox' | 'switch';
    }
  | {
      type: 'options';
      options?:
        | { label: string; value: string }[]
        | AsyncProps<any, any, any>['loadOptions'];
      control?: 'radio' | 'select';
      placeholder?: string;
    }
  | {
      type: 'date';
      config?: DatepickerConfigs;
    }
  | {
      type: 'money';
    }
  | {
      type: 'number';
      config?: NumericFormatProps;
    }
  | {
      type: 'photo';
    }
  | {
      type?: 'email' | 'password' | 'phone' | 'text';
      multiline?: boolean;
      placeholder?: string;
    };
export type FormInputProps = {
  name: string;
} & FormInputByTypeProps;
export const FormInput: React.FC<FormInputProps> = (props) => {
  const { name, type } = props;

  const form = useFormContext();
  const controller = useController({ name, control: form.control });

  // Money control
  if (type === 'money') {
    return (
      <MoneyInput
        id={name}
        value={controller.field.value}
        onChange={controller.field.onChange}
      />
    );
  }

  // Switch control
  if (type === 'boolean' && props.control === 'switch') {
    return (
      <UI.HStack spacing={3} alignItems="start" py={2}>
        <UI.Switch my="1px" {...form.register(name)} />
        <UI.FormLabel cursor="pointer" fontSize="sm">
          {props.label}
        </UI.FormLabel>
      </UI.HStack>
    );
  }

  // Checkbox control (default)
  if (type === 'boolean') {
    return (
      <UI.Box py={2}>
        <UI.Checkbox size="lg" my="1px" {...form.register(name)}>
          <UI.Text fontSize="sm">{props.label}</UI.Text>
        </UI.Checkbox>
      </UI.Box>
    );
  }

  // Datepicker control
  if (type === 'date') {
    const { config } = props;
    return (
      <SingleDatepicker
        id={'TEST'}
        name={controller.field.name}
        date={controller.field.value}
        onDateChange={controller.field.onChange}
        propsConfigs={{
          inputProps: {
            cursor: 'pointer',
          },
        }}
        configs={{
          dateFormat: 'MM/dd/yyyy',
          ...config,
        }}
      />
    );
  }

  if (type === 'options') {
    const { control, options, placeholder } = props;

    // Async select control
    if (_.isFunction(options)) {
      return (
        <AsyncSelect
          inputId={name}
          name={controller.field.name}
          value={controller.field.value}
          onChange={(value) => {
            // console.log(value);
            controller.field.onChange(value);
          }}
          placeholder={placeholder}
          loadOptions={options}
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
      if (
        (options.length <= 3 || control === 'radio') &&
        control !== 'select'
      ) {
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
          id={name}
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
  }

  if (type === 'number') {
    const { config } = props;

    return (
      <NumericFormat
        id={name}
        value={parseFloat(controller.field.value)}
        onValueChange={(values) => controller.field.onChange(values.floatValue)}
        thousandSeparator=","
        {...config}
        customInput={UI.Input}
      />
    );
  }

  if (type === 'photo') {
    return (
      <CameraInput
        {...controller.field}
        onValueChange={controller.field.onChange}
      />
    );
  }

  // Textarea control
  if (
    type === 'email' ||
    type === 'password' ||
    type === 'phone' ||
    type === 'text' ||
    type === undefined
  ) {
    const { multiline, placeholder } = props;

    if (multiline) {
      return (
        <UI.Textarea
          id={name}
          {...controller.field}
          value={controller.field.value ?? ''}
          onChange={(e) => {
            controller.field.onChange(e.target.value || undefined);
          }}
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
          onChange={(value) => {
            controller.field.onChange(value || undefined);
          }}
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
        onChange={(e) => {
          controller.field.onChange(e.target.value || undefined);
        }}
        placeholder={placeholder}
      />
    );
  }

  return null;
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
  // console.log('value', value);
  const stringValue = String(value);
  // console.log('stringValue', stringValue);

  const [formattedValue, handleOnChange, handleOnKeyDown, handleOnClick] =
    useCurrencyFormat(stringValue, {
      locale: 'en-US',
      i18nCurrency: 'USD',
      ...options,
      onChangeCallBack: (_, maskedValue, value) => {
        // console.log('value', value);
        const intValue = parseInt(removeNonNumericsExceptDash(value));
        // console.log('intValue', intValue);
        onChange?.(intValue);
      },
    });

  return (
    <UI.InputGroup>
      <UI.Input
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        onClick={handleOnClick}
        value={_.isNil(value) ? '' : formattedValue}
        {...otherProps}
      />
      <UI.InputRightElement>
        <UI.CloseButton
          onClick={() => {
            onChange?.(undefined);
          }}
        />
      </UI.InputRightElement>
    </UI.InputGroup>
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
    <UI.HStack gridColumn="1/-1" spacing={4} {...restProps}>
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
