import React from 'react';
import * as UI from '@chakra-ui/react';

import {
  getNewSortableItemOrder,
  Sortable,
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

const DndKitPage: React.FC = () => {
  const initialItems: Sortable<Person>[] = [
    { id: 1, data: { name: 'Artemis', order: 1 } },
    { id: 2, data: { name: 'Bird', order: 2 } },
    { id: 3, data: { name: 'Charlie', order: 3 } },
  ];

  const handleMove: SortableListMoveHandler<Person> = (
    items,
    fromIndex,
    toIndex
  ) => {
    let newOrder = getNewSortableItemOrder(items, fromIndex, toIndex);
    // console.log({ item: items[fromIndex], newOrder });
    // Update for local sorting
    items[fromIndex].data.order = newOrder;
    // TODO: persist to the server
  };

  return (
    <SortableList initialItems={initialItems} onMove={handleMove}>
      <UI.Stack p={4} width="280px" mx="auto">
        <SortableListItemRepeater>
          {(props, { data: person }: Sortable<Person>) => {
            const isPressed = props['aria-pressed'];
            return (
              <UI.Stack
                direction="row"
                alignItems="center"
                p={2}
                spacing={2}
                bg="gray.50"
                borderRadius="lg"
                shadow="md"
                position="relative"
                zIndex={isPressed ? 1 : 0}
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
