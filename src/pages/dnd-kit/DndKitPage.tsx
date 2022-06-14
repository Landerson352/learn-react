import React from 'react';
import * as UI from '@chakra-ui/react';

import {
  SortableList,
  SortableListItemRepeater,
  SortableListMoveHandler,
} from './helpers/sortable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface Person {
  name: string;
  order: number;
}

interface SortablePerson {
  id: number;
  data: Person;
}

const getNewPersonOrder: SortableListMoveHandler = (
  _items,
  fromIndex,
  toIndex
): number => {
  const items = _items as SortablePerson[];

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

const DndKitPage: React.FC = () => {
  const initialItems: SortablePerson[] = [
    { id: 1, data: { name: 'Artemis', order: 1 } },
    { id: 2, data: { name: 'Bird', order: 2 } },
    { id: 3, data: { name: 'Charlie', order: 3 } },
  ];

  const handleMove: SortableListMoveHandler = (items, fromIndex, toIndex) => {
    let newOrder = getNewPersonOrder(items, fromIndex, toIndex);

    // TODO: push to the server
    console.log(newOrder);
    const people = items as SortablePerson[];
    people[fromIndex].data.order = newOrder;
  };

  return (
    <SortableList initialItems={initialItems} onMove={handleMove}>
      <UI.Stack p={4} width="280px" mx="auto">
        <SortableListItemRepeater>
          {(props, item) => {
            const person = (item as SortablePerson).data;
            console.log(props);
            return (
              <UI.Stack
                direction="row"
                alignItems="center"
                p={2}
                spacing={2}
                bg="gray.50"
                borderRadius="lg"
                shadow="lg"
                position="relative"
                zIndex={props.style?.transform ? 10000 : 0}
                {...props}
              >
                <UI.Input data-no-dnd defaultValue={person.name} />
                <UI.Box p={2}>
                  <FontAwesomeIcon icon={faBars} />
                </UI.Box>
              </UI.Stack>
            );
          }}
        </SortableListItemRepeater>
      </UI.Stack>
    </SortableList>
  );
};

export default DndKitPage;
