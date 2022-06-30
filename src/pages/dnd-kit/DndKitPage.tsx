import React from 'react';
import * as UI from '@chakra-ui/react';

import {
  Sortable,
  SortableList,
  SortableListItemRepeater,
} from './helpers/sortable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { arrayMove } from '@dnd-kit/sortable';
import { useForm, useFieldArray } from 'react-hook-form';

interface Person {
  name: string;
}

type SortablePerson = Sortable<Person>;

interface PersonsFormData {
  persons: SortablePerson[];
}

const initialPersons: SortablePerson[] = [
  { id: 1, data: { name: 'Artemis' } },
  { id: 2, data: { name: 'Bird' } },
  { id: 3, data: { name: 'Charlie' } },
];

const DraggableRow = React.forwardRef<HTMLDivElement, UI.StackProps>(
  ({ children, ...stackProps }, ref) => {
    const pressed = !!stackProps['aria-pressed'];
    return (
      <UI.Stack
        ref={ref}
        direction="row"
        alignItems="center"
        p={2}
        spacing={2}
        bg="gray.50"
        borderRadius="lg"
        shadow="md"
        position="relative"
        zIndex={pressed ? 1 : 0}
        {...stackProps}
      >
        {children}
        <UI.Box p={2}>
          <FontAwesomeIcon icon={faBars} />
        </UI.Box>
      </UI.Stack>
    );
  }
);

const SortableWithState: React.FC = () => {
  const [items, setItems] = React.useState<SortablePerson[]>(initialPersons);

  const handleMove = (activeIndex: number, overIndex: number) => {
    setItems((items) => arrayMove(items, activeIndex, overIndex));
  };

  return (
    <SortableList items={items} onMove={handleMove}>
      <UI.Stack width="280px">
        <SortableListItemRepeater>
          {(props, { id, data: person }: SortablePerson) => (
            <DraggableRow key={id} {...props}>
              <UI.Input defaultValue={person.name} />
            </DraggableRow>
          )}
        </SortableListItemRepeater>
      </UI.Stack>
    </SortableList>
  );
};

const SortableWithHookForm: React.FC = () => {
  const { formState, ...form } = useForm<PersonsFormData>({
    defaultValues: {
      persons: initialPersons,
    },
  });
  const personsArray = useFieldArray({
    name: 'persons',
    control: form.control,
  });

  const handleMove = (activeIndex: number, overIndex: number) => {
    personsArray.move(activeIndex, overIndex);
  };

  return (
    <SortableList items={personsArray.fields} onMove={handleMove}>
      <UI.Stack width="280px">
        <SortableListItemRepeater>
          {(props, { id }: SortablePerson, index) => (
            <DraggableRow key={id} {...props}>
              <UI.Input {...form.register(`persons.${index}.data.name`)} />
            </DraggableRow>
          )}
        </SortableListItemRepeater>
      </UI.Stack>
    </SortableList>
  );
};

const DndKitPage: React.FC = () => {
  return (
    <UI.Stack p={8} spacing={8} alignItems="center">
      <UI.Heading size="md">Using component state</UI.Heading>
      <SortableWithState />
      <UI.Heading size="md">Using hook-form</UI.Heading>
      <SortableWithHookForm />
    </UI.Stack>
  );
};

export default DndKitPage;
