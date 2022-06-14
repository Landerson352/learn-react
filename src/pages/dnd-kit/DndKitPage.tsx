import React from 'react';
import * as UI from '@chakra-ui/react';

import {
  SortableItemData,
  SortableList,
  SortableListItemRepeater,
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

const DndKitPage: React.FC = () => {
  const initialItems: SortablePerson[] = [
    { id: 1, data: { name: 'Artemis', order: 1 } },
    { id: 2, data: { name: 'Bird', order: 2 } },
    { id: 3, data: { name: 'Charlie', order: 3 } },
  ];

  const handleMove = (
    from: { item: SortableItemData; index: number },
    to: { item: SortableItemData; index: number }
  ) => {
    console.log(from, to);
  };

  return (
    <SortableList initialItems={initialItems} onMove={handleMove}>
      <UI.Stack p={4} width="280px" mx="auto">
        <SortableListItemRepeater>
          {(props, item) => {
            const person = (item as SortablePerson).data;
            return (
              <UI.Stack
                direction="row"
                alignItems="center"
                p={2}
                spacing={2}
                bg="gray.50"
                borderRadius="lg"
                shadow="lg"
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
