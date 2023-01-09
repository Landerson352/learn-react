import * as UI from '@chakra-ui/react';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDebounce } from 'react-use';

export const INPUT_DEBOUNCE_MS = 500;

export type DebouncedInputProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  leftIcon?: FontAwesomeIconProps;
  rightIcon?: FontAwesomeIconProps;
} & Omit<UI.InputProps, 'value' | 'onChange'>;

export const DebouncedInput: React.FC<DebouncedInputProps> = (props, ref) => {
  const {
    value: initialValue,
    onChange,
    debounce = INPUT_DEBOUNCE_MS,
    leftIcon,
    rightIcon,
    isDisabled,
    ...inputProps
  } = props;
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useDebounce(
    () => {
      onChange(value);
    },
    debounce,
    [value]
  );

  // Soft-disable the input if it's disabled
  // This allows focus to be maintained on the input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled) {
      setValue(e.target.value);
    }
  };

  return (
    <UI.InputGroup>
      {leftIcon ? (
        <UI.InputLeftElement>
          <FontAwesomeIcon {...leftIcon} />
        </UI.InputLeftElement>
      ) : null}
      <UI.Input {...inputProps} value={value} onChange={handleChange} />
      {rightIcon ? (
        <UI.InputLeftElement>
          <FontAwesomeIcon {...rightIcon} />
        </UI.InputLeftElement>
      ) : null}
    </UI.InputGroup>
  );
};
