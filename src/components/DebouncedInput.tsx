import React from 'react';
import { useDebounce } from 'react-use';
import * as UI from '@chakra-ui/react';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export const INPUT_DEBOUNCE_MS = 500;

export type DebouncedInputProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  leftIcon?: FontAwesomeIconProps;
  rightIcon?: FontAwesomeIconProps;
} & UI.InputProps;

export const DebouncedInput: React.FC<DebouncedInputProps> = (props, ref) => {
  const {
    value: initialValue,
    onChange,
    debounce = INPUT_DEBOUNCE_MS,
    leftIcon,
    rightIcon,
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

  return (
    <UI.InputGroup>
      {leftIcon ? (
        <UI.InputLeftElement>
          <FontAwesomeIcon {...leftIcon} />
        </UI.InputLeftElement>
      ) : null}
      <UI.Input
        {...inputProps}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {rightIcon ? (
        <UI.InputLeftElement>
          <FontAwesomeIcon {...rightIcon} />
        </UI.InputLeftElement>
      ) : null}
    </UI.InputGroup>
  );
};
