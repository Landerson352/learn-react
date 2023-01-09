/**
 * A View is a container that can be used to manage the layout of child elements.
 * It is essentially a vertical flexbox container with some additional features.
 *
 * The "rigid" prop can be used to disable the stretch/fill behavior of the View.
 * The "scroll" prop can be used to make the View scrollable.
 * The "debug" prop can be used to add a border to the View and all descendant views.
 */

import * as UI from '@chakra-ui/react';
import React from 'react';

export type ViewProps = UI.BoxProps & {
  rigid?: boolean;
  level?: number;
  scroll?: boolean;
  debug?: boolean;
};

const levelColors = ['yellow', 'cyan', 'magenta', 'lime', 'red'];

const ViewContext = React.createContext<ViewProps>({});

export const View: React.FC<ViewProps> = (props) => {
  const parentViewProps = React.useContext(ViewContext);
  const combinedProps: ViewProps = {
    debug: parentViewProps.debug,
    level: (parentViewProps.level ?? -1) + 1,
    flexDirection: 'column',
    scroll: true,
    rigid: false,
    ...props,
  };

  const { debug, rigid, level, scroll, ...boxProps } = combinedProps;

  const borderProps = debug
    ? {
        borderColor: levelColors[(level || 0) % levelColors.length],
        borderWidth: '4px',
        borderStyle: 'solid',
        borderRadius: 'lg',
      }
    : null;

  return (
    <ViewContext.Provider value={combinedProps}>
      <UI.Box
        display={boxProps.flexDirection ? 'flex' : undefined}
        overflow={scroll ? 'auto' : undefined}
        flex={rigid ? 'none' : '1 1 0'}
        h={!rigid && parentViewProps.flexDirection === 'column' ? 0 : undefined}
        w={!rigid && parentViewProps.flexDirection === 'row' ? 0 : undefined}
        {...borderProps}
        {...boxProps}
      />
    </ViewContext.Provider>
  );
};
