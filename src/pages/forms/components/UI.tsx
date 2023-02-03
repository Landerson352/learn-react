import * as UI from '@chakra-ui/react';
import {
  faCircleExclamation,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  RangeDatepicker,
  RangeDatepickerProps,
  SingleDatepicker,
  SingleDatepickerProps,
} from 'chakra-dayzed-datepicker';
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
import { CameraInput, CameraInputProps } from './CameraInput';

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
  if (width >= 260) {
    columns = 2;
  }
  if (width >= 260 * 2) {
    columns = 4;
  }
  if (width >= 260 * 4) {
    columns = 8;
  }

  const gridProps = {
    ref: measureRef,
    columns,
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
export type FormFieldProps = Omit<FullFormControlProps, 'type'> &
  FormInputProps;
export const FormField: React.FC<FormFieldProps> = ({
  name,
  type,
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
      {/* @ts-ignore */}
      <FormInput name={name} type={type} input={input} />
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
      type: 'checkbox';
      /**
       * Supports all props of [@chakra-ui/checkbox](https://chakra-ui.com/docs/form/checkbox)
       * */
      input?: CheckboxInputProps;
    }
  | {
      type: 'switch';
      /**
       * Supports all props of [@chakra-ui/switch](https://chakra-ui.com/docs/form/switch)
       * */
      input?: SwitchInputProps;
    }
  | {
      type: 'combobox';
      /**
       * Supports all props of [chakra-react-select/AsyncSelect](https://www.npmjs.com/package/chakra-react-select), and by extension [react-select/async](https://react-select.com/async)
       */
      input?: ComboboxInputProps;
    }
  | {
      type: 'radio';
      /**
       * Supports all props of [@chakra-ui/radiogroup](https://chakra-ui.com/docs/form/radio)
       */
      input: RadioWithOptionsProps;
    }
  | {
      type: 'select';
      /**
       * Supports all props of [@chakraui/select](https://chakra-ui.com/docs/form/select)
       */
      input: SelectWithOptionsProps;
    }
  | {
      type: 'date';
      /**
       * Supports all props of [chakra-dayzed-datepicker/SingleDatepicker](https://www.npmjs.com/package/chakra-dayzed-datepicker)
       */
      input?: Partial<DateInputProps>;
    }
  | {
      type: 'daterange';
      /**
       * Supports all props of [chakra-dayzed-datepicker/RangeDatepicker](https://www.npmjs.com/package/chakra-dayzed-datepicker)
       */
      input?: Partial<DateRangeInputProps>;
    }
  | {
      type: 'money';
      /**
       * Supports all props of [input-currency-react](https://www.npmjs.com/package/input-currency-react)
       */
      input?: Partial<MoneyInputProps>;
    }
  | {
      type: 'number';
      /**
       * Supports all props of [react-number-format/NumericFormat](https://www.npmjs.com/package/react-number-format)
       */
      input?: Partial<NumberInputProps>;
    }
  | {
      type: 'photo';
      input?: Partial<CameraInputProps>;
    }
  | {
      type: 'textarea';
      /**
       * Supports all props of [@chakra-ui/textarea](https://chakra-ui.com/docs/form/textarea)
       * */
      input?: UI.TextareaProps;
    }
  | { type: 'phone'; input?: Partial<MaskedInputProps> }
  | {
      type?: 'email' | 'password' | 'text';
      /**
       * Supports all props of [@chakra-ui/input](https://chakra-ui.com/docs/form/input)
       * */
      input?: TextInputProps;
    };

export type FormInputProps = {
  name: string;
} & FormInputByTypeProps;
export const FormInput: React.FC<FormInputProps> = (props) => {
  const { name, type } = props;

  const form = useFormContext();
  const controller = useController({ name, control: form.control });

  if (type === 'money') {
    return (
      <MoneyInput
        {...props.input}
        id={controller.field.name}
        value={controller.field.value}
        onChange={controller.field.onChange}
      />
    );
  }

  if (type === 'switch') {
    return <SwitchInput {...props.input} {...form.register(name)} />;
  }

  if (type === 'checkbox') {
    return <CheckboxInput {...props.input} {...form.register(name)} />;
  }

  if (type === 'date') {
    return (
      <DateInput
        {...props.input}
        date={controller.field.value}
        onDateChange={controller.field.onChange}
      />
    );
  }

  if (type === 'daterange') {
    return (
      <DateRangeInput
        {...props.input}
        selectedDates={controller.field.value || []}
        onDateChange={controller.field.onChange}
      />
    );
  }

  if (type === 'combobox') {
    return (
      <ComboboxInput
        {...props.input}
        inputId={controller.field.name}
        value={controller.field.value}
        onChange={(value) => {
          controller.field.onChange(value);
        }}
      />
    );
  }

  if (type === 'radio') {
    return (
      <RadioWithOptions
        {...props.input}
        value={controller.field.value}
        onChange={controller.field.onChange}
      />
    );
  }

  if (type === 'select') {
    return (
      <SelectWithOptions
        {...props.input}
        id={controller.field.name}
        {...controller.field}
      />
    );
  }

  if (type === 'number') {
    return (
      <NumberInput
        {...props.input}
        id={controller.field.name}
        value={parseFloat(controller.field.value)}
        onValueChange={(values) => controller.field.onChange(values.floatValue)}
      />
    );
  }

  if (type === 'photo') {
    return (
      <CameraInput
        {...props.input}
        value={controller.field.value}
        onChange={controller.field.onChange}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <UI.Textarea
        {...props.input}
        {...controller.field}
        id={controller.field.name}
        onChange={(e) => {
          // Assist validation in identifying empty strings as undefined.
          controller.field.onChange(e.target.value || undefined);
        }}
      />
    );
  }

  if (type === 'phone') {
    const mask = subtypeMetas[type].mask;
    return (
      <MaskedInput
        data-lpignore="true"
        {...props.input}
        {...controller.field}
        type={type === 'phone' ? 'tel' : undefined}
        id={controller.field.name}
        maskGenerator={mask}
        value={controller.field.value ?? ''}
        onChange={(value) => {
          // Assist validation in identifying empty strings as undefined.
          controller.field.onChange(value || undefined);
        }}
      />
    );
  }

  if (
    type === 'email' ||
    type === 'password' ||
    type === 'text' ||
    type === undefined
  ) {
    return (
      <UI.Input
        type={type}
        data-lpignore="true"
        {...props.input}
        {...controller.field}
        id={controller.field.name}
        value={controller.field.value ?? ''}
        onChange={(e) => {
          // Assist validation in identifying empty strings as undefined.
          controller.field.onChange(e.target.value || undefined);
        }}
      />
    );
  }

  return null;
};

export type RadioWithOptionsProps = {
  options: { value: string; label: string }[];
  direction?: 'horizontal' | 'vertical' | undefined;
} & Omit<UI.RadioGroupProps, 'children'>;
export const RadioWithOptions: React.FC<RadioWithOptionsProps> = (props) => {
  const { options, direction, ...restProps } = props;

  const optionElements = options.map((option) => (
    <UI.Radio key={option.value} value={option.value}>
      {option.label}
    </UI.Radio>
  ));

  return (
    <UI.RadioGroup {...restProps}>
      {direction === 'horizontal' ? (
        <UI.HStack alignItems="center" spacing={4} minH={10}>
          {optionElements}
        </UI.HStack>
      ) : (
        /* These stack dimensions render a 2-option radio that is the same
            height as other form inputs. */
        <UI.VStack alignItems="start" spacing={0} my="-2px">
          {optionElements}
        </UI.VStack>
      )}
    </UI.RadioGroup>
  );
};

export type NumberInputProps = NumericFormatProps<UI.InputProps>;
export const NumberInput: React.FC<NumberInputProps> = (props) => {
  return (
    <NumericFormat thousandSeparator="," customInput={UI.Input} {...props} />
  );
};

export type SelectWithOptionsProps = {
  options: { label: string; value: string }[];
} & UI.SelectProps;
export const SelectWithOptions = React.forwardRef<
  HTMLSelectElement,
  SelectWithOptionsProps
>(({ options, ...restProps }, ref) => {
  return (
    <UI.Select ref={ref} placeholder="Choose one" {...restProps}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </UI.Select>
  );
});

export type ComboboxInputProps = AsyncProps<any, any, any>;
export const ComboboxInput: React.FC<ComboboxInputProps> = (props) => {
  return (
    <AsyncSelect
      defaultOptions
      cacheOptions
      isClearable
      openMenuOnFocus={false}
      openMenuOnClick={false}
      {...props}
    />
  );
};

export type DateInputProps = SingleDatepickerProps;
export const DateInput: React.FC<DateInputProps> = (props) => {
  const defaultProps: Partial<DateInputProps> = {
    propsConfigs: {
      inputProps: {
        cursor: 'pointer',
      },
    },
    configs: {
      dateFormat: 'MM/dd/yyyy',
    },
  };
  return <SingleDatepicker {..._.merge(defaultProps, props)} />;
};

export type DateRangeInputProps = RangeDatepickerProps;
export const DateRangeInput: React.FC<DateRangeInputProps> = (props) => {
  const defaultProps: Partial<DateRangeInputProps> = {
    propsConfigs: {
      inputProps: {
        cursor: 'pointer',
      },
    },
    configs: {
      dateFormat: 'MM/dd/yyyy',
    },
  };
  return <RangeDatepicker {..._.merge(defaultProps, props)} />;
};

export type CheckboxInputProps = { label?: string } & UI.CheckboxProps;
export const CheckboxInput = React.forwardRef<
  HTMLInputElement,
  CheckboxInputProps
>(({ label, ...restProps }, ref) => {
  return (
    <UI.Checkbox ref={ref} py={2} size="lg" my="1px" {...restProps}>
      {label ? <UI.Text fontSize="sm">{label}</UI.Text> : null}
    </UI.Checkbox>
  );
});

export type SwitchInputProps = { label?: string } & UI.StackProps;
export const SwitchInput = React.forwardRef<HTMLInputElement, SwitchInputProps>(
  ({ label, ...restProps }, ref) => {
    return (
      <UI.HStack spacing={3} alignItems="start" py={2} {...restProps}>
        <UI.Switch ref={ref} my="1px" />
        {label ? (
          <UI.FormLabel cursor="pointer" fontWeight="normal" fontSize="sm">
            {label}
          </UI.FormLabel>
        ) : null}
      </UI.HStack>
    );
  }
);

export type TextInputProps = UI.InputProps;
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    return <UI.Input ref={ref} {...props} />;
  }
);

type MaskedInputProps = Parameters<typeof RHMMaskedInput>[0] & UI.InputProps;
export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ value = '', onChange, maskGenerator, keepMask, ...restProps }, ref) => {
    const webMask = useWebMask({
      value,
      onChange,
      maskGenerator,
      keepMask,
      ref,
    });
    return <UI.Input {...restProps} {...webMask} />;
  }
);

export type MoneyInputProps = {
  options?: CurrencyInputProps['options'];
  value: number | undefined;
  onChange(value: number | undefined): any;
} & Omit<UI.InputProps, 'value'>;
export const MoneyInput: React.FC<MoneyInputProps> = (props) => {
  const { value, options, onChange, ...restProps } = props;
  const stringValue = String(value);

  const [formattedValue, handleOnChange, handleOnKeyDown, handleOnClick] =
    useCurrencyFormat(stringValue, {
      locale: 'en-US',
      i18nCurrency: 'USD',
      ...options,
      onChangeCallBack: (_, maskedValue, value) => {
        const intValue = parseInt(removeNonNumericsExceptDash(value));
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
        {...restProps}
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
