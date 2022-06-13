import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import _ from 'lodash';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

export const SortableListItems: React.FC<{
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
