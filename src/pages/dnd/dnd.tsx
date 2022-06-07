import React from 'react';
import {
  ConnectDragPreview,
  DragSourceHookSpec,
  DropTargetHookSpec,
  FactoryOrInstance,
  useDrag as _useDrag,
  useDragLayer,
  useDrop as _useDrop,
} from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Backends, DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

/**
 * These portable helpers are meant to provide some sensible hook defaults,
 * and simplify the usage of both HTML5 and touch backends.
 */

export const useDisablePreview = (preview: ConnectDragPreview) => {
  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
};

export const useDrag = function <
  DragObject = unknown,
  DropResult = unknown,
  CollectedProps = unknown
>(
  specArg: FactoryOrInstance<
    DragSourceHookSpec<DragObject, DropResult, CollectedProps>
  >,
  deps?: unknown[]
) {
  const result = _useDrag(
    () => ({
      ...(typeof specArg === 'function' ? specArg() : specArg),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    deps
  );

  useDisablePreview(result[2]);

  return result;
};

export const useDrop = function <
  DragObject = unknown,
  DropResult = unknown,
  CollectedProps = unknown
>(
  specArg: FactoryOrInstance<
    DropTargetHookSpec<DragObject, DropResult, CollectedProps>
  >,
  deps?: unknown[]
) {
  const result = _useDrop(
    () => ({
      ...(typeof specArg === 'function' ? specArg() : specArg),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    deps
  );

  return result;
};

export const useCustomDragLayer = function () {
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

export const DnDMultiProvider: React.FC<{
  context?: any;
  debugMode?: boolean | undefined;
  options?: Backends;
}> = (props) => {
  return <DndProvider options={HTML5toTouch} {...props} />;
};
