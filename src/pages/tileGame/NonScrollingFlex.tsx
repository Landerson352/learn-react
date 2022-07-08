import React from 'react';
import * as UI from '@chakra-ui/react';

const NonScrollingFlexRoot: React.FC<{ direction?: 'column' | 'row' }> = ({
  children,
  direction = 'column',
}) => {
  const ref = React.useRef<HTMLStyleElement>(null);

  React.useEffect(() => {
    if (ref.current?.parentElement?.id !== 'root') {
      console.error('NonScrollingFlexRoot component not mounted on root.');
    }
  });

  return (
    <React.Fragment>
      <style ref={ref}>
        {`
        html, body, #root {
          height: 100%;
          display: flex;
          flex-direction: ${direction};
          flex: 1 1 0;
          align-self: stretch;
          overflow: hidden;
        }
        `}
      </style>
      {children}
    </React.Fragment>
  );
};

const NonScrollingFlexChild: React.FC<UI.BoxProps> = (props) => {
  return (
    <UI.Box
      flex="1 1 0"
      d="flex"
      flexDirection="column"
      overflow="hidden"
      {...props}
    />
  );
};

export const NonScrollingFlex = {
  Root: NonScrollingFlexRoot,
  Child: NonScrollingFlexChild,
};
