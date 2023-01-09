import * as UI from '@chakra-ui/react';
import React from 'react';

import { useCustomDragLayer } from './hooks';

/**
 * A generic component for ALL drag and drop previews.
 */
const CustomDragLayer: React.FC<
  {
    children: (
      dragLayer: ReturnType<typeof useCustomDragLayer>
    ) => React.ReactNode;
  } & Omit<UI.BoxProps, 'children'>
> = ({ children, ...boxProps }) => {
  const dragLayer = useCustomDragLayer();

  if (!dragLayer.isOffset) {
    return null;
  }

  const transform = `translate(${dragLayer.currentOffset?.x}px, ${dragLayer.currentOffset?.y}px)`;

  return (
    <UI.Box
      position="fixed"
      pointerEvents="none"
      zIndex={100}
      left={0}
      top={0}
      transform={transform}
      {...boxProps}
    >
      {children(dragLayer)}
    </UI.Box>
  );
};

export default CustomDragLayer;
