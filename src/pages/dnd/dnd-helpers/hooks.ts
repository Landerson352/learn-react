import React from 'react';
import { ConnectDragPreview, useDragLayer } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

export const useDisableNativePreview = (preview: ConnectDragPreview) => {
  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
};

export const useCustomDragLayer = () => {
  const result = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const isOffset =
    result.isDragging && result.initialOffset && result.currentOffset;

  return {
    isOffset,
    ...result,
  };
};
