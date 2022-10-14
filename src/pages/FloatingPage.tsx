import React from 'react';
import * as UI from '@chakra-ui/react';
import {
  autoUpdate,
  MiddlewareArguments,
  useFloating,
} from '@floating-ui/react-dom';

// Middleware to keep the floating element in the corner with the most space
const corner = {
  name: 'corner',
  fn: ({ rects: { reference, floating } }: MiddlewareArguments) => {
    const onLeft = window.innerWidth / 2 > reference.x + reference.width / 2;
    const onTop = window.innerHeight / 2 > reference.y + reference.height / 2;

    // Magic 0.1px is added to the floating element to indicate corner placement
    // This should be removed before rendering
    const x = onLeft
      ? Math.round(reference.x + reference.width)
      : Math.round(reference.x - floating.width) + 0.1;
    const y = onTop
      ? Math.round(reference.y + reference.height)
      : Math.round(reference.y - floating.height) + 0.1;

    return { x, y };
  },
};

// Hook to handle unwrapping the extra 0.1px added to the floating element, and indicate placement
const useFloatingCorner = () => {
  const { x, y, ...rest } = useFloating({
    middleware: [corner],
    whileElementsMounted: autoUpdate,
  });

  const top = Math.round(y ?? 0);
  const left = Math.round(x ?? 0);

  const placement =
    top !== y && left !== x
      ? 'top-left'
      : top !== y && left === x
      ? 'top-right'
      : top === y && left !== x
      ? 'bottom-left'
      : 'bottom-right';

  return { top, left, ...rest, placement };
};

const FloatingPage: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const { reference, floating, top, left, strategy, placement } =
    useFloatingCorner();

  const handleButtonMouseOver = () => {
    setVisible(true);
  };
  const handleButtonMouseOut = () => {
    setVisible(false);
  };

  const sharpCornerProps = {
    borderTopRightRadius: placement === 'bottom-left' ? 0 : '',
    borderBottomRightRadius: placement === 'top-left' ? 0 : '',
    borderBottomLeftRadius: placement === 'top-right' ? 0 : '',
    borderTopLeftRadius: placement === 'bottom-right' ? 0 : '',
  };

  return (
    <UI.Box p="4">
      <UI.Heading size="3xl" mb={8}>
        Floating UI
      </UI.Heading>

      <UI.Button
        ref={reference}
        onMouseOver={handleButtonMouseOver}
        onMouseOut={handleButtonMouseOut}
        colorScheme="blue"
        borderRadius="sm"
        // ml="800px"
        // mt="800px"
      >
        Button
      </UI.Button>
      <UI.Box
        ref={floating}
        bg="gray.700"
        color="white"
        fontSize="sm"
        p="50px"
        borderRadius="50px"
        {...sharpCornerProps}
        pointerEvents="none"
        opacity={visible ? 1 : 0}
        transition="opacity 0.2s"
        position={strategy}
        top={top}
        left={left}
        maxW="280px"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </UI.Box>
    </UI.Box>
  );
};

export default FloatingPage;
