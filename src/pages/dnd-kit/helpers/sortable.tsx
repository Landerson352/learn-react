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
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export type SortableItemData =
  | UniqueIdentifier
  | {
      id: UniqueIdentifier;
    };

export const SortableListContext = React.createContext<{
  items: SortableItemData[];
}>({
  items: [],
});

export const SortableList: React.FC<{
  initialItems: SortableItemData[];
  children: React.ReactNode;
  onMove: (
    a: { item: SortableItemData; index: number },
    b: { item: SortableItemData; index: number }
  ) => any;
}> = ({ initialItems, children, onMove }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [items, setItems] = React.useState<SortableItemData[]>(initialItems);

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

        onMove(
          { item: items[oldIndex], index: oldIndex },
          { item: items[newIndex], index: newIndex }
        );

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

export const SortableListItemRepeater: React.FC<{
  children: (
    props: React.HTMLAttributes<HTMLDivElement> & {
      ref: (node: HTMLElement | null) => void;
    },
    id: SortableItemData
  ) => React.ReactElement;
}> = ({ children }) => {
  const { items } = React.useContext(SortableListContext);
  return (
    <React.Fragment>
      {items.map((_id) => {
        const id = _.get(_id, 'id', _id) as UniqueIdentifier;
        return (
          <SortableListItem key={id} id={id}>
            {(props) => children(props, _id)}
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
