import * as UI from '@chakra-ui/react';
import React from 'react';
import { MaskedInput as RHMMaskedInput, useWebMask } from 'react-hook-mask';

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

  return <UI.Input {...restProps} {...webMask} />;
});
