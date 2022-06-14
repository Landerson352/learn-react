import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import _ from 'lodash';
import {
  DndContext,
  closestCenter,
  MouseSensor as LibMouseSensor,
  KeyboardSensor as LibKeyboardSensor,
  PointerSensor as LibPointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const SortableListContext = React.createContext<{
  items: Sortable<any>[];
}>({
  items: [],
});

export interface Sortable<T> {
  id: number;
  data: T;
}

export type SortableListMoveHandler<T> = (
  items: Sortable<T>[],
  fromIndex: number,
  toIndex: number
) => any;

export const SortableList = function <T>({
  initialItems,
  children,
  onMove,
}: {
  initialItems: Sortable<T>[];
  children: React.ReactNode;
  onMove: SortableListMoveHandler<T>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [items, setItems] = React.useState<Sortable<T>[]>(initialItems);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = _.findIndex(
          items,
          (o) => _.get(o, 'id', o) === active.id
        );
        const newIndex = _.findIndex(
          items,
          (o) => _.get(o, 'id', o) === over.id
        );

        onMove(items, oldIndex, newIndex);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <SortableListContext.Provider value={{ items }}>
          {children}
        </SortableListContext.Provider>
      </SortableContext>
    </DndContext>
  );
};

type UseSortableParameter = Parameters<typeof useSortable>[0];

export const SortableListItem: React.FC<
  {
    children: React.FC<
      React.HTMLAttributes<HTMLDivElement> & {
        ref: (node: HTMLElement | null) => void;
      }
    >;
  } & UseSortableParameter
> = ({ children, ...params }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable(params);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return children({
    ref: setNodeRef,
    ...attributes,
    ...listeners,
    style,
  });
};

export type SortableListItemRenderer<T> = (
  props: React.HTMLAttributes<HTMLDivElement> & {
    ref: (node: HTMLElement | null) => void;
  },
  item: Sortable<T>
) => React.ReactElement;

export const SortableListItemRepeater: React.FC<{
  children: SortableListItemRenderer<any>;
}> = ({ children }) => {
  const { items } = React.useContext(SortableListContext);
  return (
    <React.Fragment>
      {items.map((item) => {
        return (
          <SortableListItem key={item.id} id={item.id}>
            {(props) => children(props, item)}
          </SortableListItem>
        );
      })}
    </React.Fragment>
  );
};

// Filters out elements with 'data-no-dnd' attribute
function shouldHandleEvent(element: HTMLElement | null) {
  let cur = element;

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}

export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler: ({ nativeEvent: event }: React.MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

export class KeyboardSensor extends LibKeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: ({ nativeEvent: event }: React.KeyboardEvent<Element>) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

export class PointerSensor extends LibPointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: React.PointerEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

export const getNewSortableItemOrder: SortableListMoveHandler<any> = (
  items,
  fromIndex,
  toIndex
): number => {
  let newOrder = items[fromIndex].data.order;
  if (fromIndex < toIndex) {
    // moving down, place after the "to" item
    // if "to" is the last item, add 1 to its order
    if (toIndex === items.length - 1) {
      newOrder = items[toIndex].data.order + 1;
      // otherwise, average the order of the "to" item and the one after it
    } else {
      newOrder =
        (items[toIndex].data.order + items[toIndex + 1].data.order) / 2;
    }
  } else if (fromIndex > toIndex) {
    // moving up, place before the "to" item
    // if "to" is the first item, subtract 1 to its order
    if (toIndex === 0) {
      newOrder = items[toIndex].data.order - 1;
      // otherwise, average the order of the "to" item and the one before it
    } else {
      newOrder =
        (items[toIndex].data.order + items[toIndex - 1].data.order) / 2;
    }
  }

  return newOrder;
};
