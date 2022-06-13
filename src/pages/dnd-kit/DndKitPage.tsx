import React from 'react';
import * as UI from '@chakra-ui/react';

import { SortableItemData, SortableList, SortableListItems } from './sortable';

interface ExamplePersonType {
  id: number;
  name: string;
}

const DndKitPage: React.FC = () => {
  const initialItems: ExamplePersonType[] = [
    { id: 1, name: 'Artemis' },
    { id: 2, name: 'Bird' },
    { id: 3, name: 'Charlie' },
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
        <SortableListItems>
          {(props, item) => {
            const person = item as ExamplePersonType;
            return (
              <UI.Box
                {...props}
                px={4}
                py={3}
                bg="gray.50"
                borderRadius="lg"
                shadow="lg"
              >
                {person.name}
              </UI.Box>
            );
          }}
        </SortableListItems>
      </UI.Stack>
    </SortableList>
  );
};

export default DndKitPage;
