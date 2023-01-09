import * as UI from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import * as reactRouter from 'react-router-dom';

import { useRouteModal } from './routeModal';

export const ExampleModal: React.FC<Omit<UI.ModalProps, 'children'>> = (
  props
) => {
  return (
    <UI.Modal {...props}>
      <UI.ModalOverlay />
      <UI.ModalContent>
        <UI.ModalHeader>Modal Title</UI.ModalHeader>
        <UI.ModalCloseButton />
        <UI.ModalBody>...</UI.ModalBody>

        <UI.ModalFooter>
          <UI.Button colorScheme="blue" mr={3} onClick={props.onClose}>
            Close
          </UI.Button>
        </UI.ModalFooter>
      </UI.ModalContent>
    </UI.Modal>
  );
};

const ModalIntro: React.FC = () => {
  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with modals
      </UI.Heading>
      <UI.Text mb={4}>
        Use component-state modals for simple messages, or when you explicitly
        want to block the page below.
      </UI.Text>
      <UI.Text mb={4}>
        Use router-synced modals for larger modals that act and feel like pages.
        (Actually you should strongly consider just making a new page instead,
        but sometimes you can't esape it.)
      </UI.Text>
    </UI.Box>
  );
};

const ModalExample: React.FC = () => {
  const modal = UI.useDisclosure();
  return (
    <UI.Box mb={8}>
      <ExampleModal {...modal} />

      <UI.Heading size="md" mb={4}>
        Component-state modals
      </UI.Heading>
      <UI.Text mb={4}>
        Notice how this modal dissappears when you refresh the page, and if you
        press the browser back button, you leave the page.
      </UI.Text>
      <UI.Button onClick={modal.onOpen}>Open modal</UI.Button>
    </UI.Box>
  );
};

const ModalExample2: React.FC = () => {
  const [routeModal, routeModalHref] = useRouteModal('example');
  return (
    <UI.Box mb={8}>
      <ExampleModal {...routeModal} />

      <UI.Heading size="md" mb={4}>
        Router-synced modals
      </UI.Heading>
      <UI.Text mb={4}>
        Notice how this router remains when you refresh the page, and if you
        press the browser back button, the modal closes.
      </UI.Text>
      <UI.UnorderedList mb={4}>
        <UI.ListItem>
          <UI.Link as={reactRouter.Link} to={routeModalHref} color="blue.300">
            Open modal via link (href method)
          </UI.Link>
        </UI.ListItem>
        <UI.ListItem>
          <UI.Link onClick={routeModal.onOpen} color="blue.300">
            Open modal via link (onClick method)
          </UI.Link>
        </UI.ListItem>
      </UI.UnorderedList>
      <UI.Alert status="warning">
        <UI.AlertDescription>
          Note: With this method, you must add a route with a relative modal
          path.
        </UI.AlertDescription>
      </UI.Alert>
    </UI.Box>
  );
};

const ModalExamplesPage: React.FC = () => {
  const exampleComponents = [ModalIntro, ModalExample, ModalExample2];

  return (
    <UI.Box p="4">
      <UI.Heading size="3xl" mb={8}>
        Modal examples
      </UI.Heading>

      <UI.SimpleGrid minChildWidth="400px" spacing={2}>
        {_.map(exampleComponents, (Component) => (
          <UI.Box
            key={Component.name}
            bg="white"
            borderRadius="8px"
            p={6}
            minH="240px"
          >
            <Component />
          </UI.Box>
        ))}
      </UI.SimpleGrid>
    </UI.Box>
  );
};

export default ModalExamplesPage;
