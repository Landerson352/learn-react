import _ from 'lodash';
import React from 'react';
import * as UI from '@chakra-ui/react';

import { DnDMultiProvider, useCustomDragLayer, useDrag, useDrop } from './dnd';
import { ChessState, ItemTypes, KnightPosition } from './chess';

/**
 * In this example, we use our chess app logic and dnd helpers
 * to create a drag-and drop interface.
 */

const Knight: React.FC = () => {
  // Inform dnd that we can drag this knight
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.KNIGHT,
  });

  return (
    <UI.Box
      ref={drag}
      height={8}
      width={8}
      fontSize="48px"
      fontWeight="bold"
      cursor="move"
      lineHeight="24px"
      opacity={isDragging ? 0 : 1}
    >
      ♘
    </UI.Box>
  );
};

const BoardSquare: React.FC<{ pos: KnightPosition }> = ({ pos }) => {
  const chess = ChessState.useContext();
  // Inform dnd that we can (sometimes) drop a knight on this square
  const [dropState, drop] = useDrop(
    {
      accept: ItemTypes.KNIGHT,
      canDrop: () => chess.canMoveKnightTo(pos),
      drop: () => chess.moveKnightTo(pos),
    },
    [pos.x, pos.y, chess.canMoveKnightTo, chess.moveKnightTo]
  );

  const black = (pos.x + pos.y) % 2 === 1;
  const knightIsHere = chess.knightIsAt(pos);

  // Style the border dependsing on the drag-and-drop state
  const borderColor = dropState.isOver
    ? dropState.canDrop
      ? 'green.500'
      : 'red.500'
    : dropState.canDrop
    ? 'yellow.500'
    : 'transparent';

  return (
    <UI.Box
      ref={drop}
      border="4px solid"
      borderColor={borderColor}
      bg={black ? 'black' : 'white'}
      color={black ? 'white' : 'black'}
      w={10}
      h={10}
    >
      {knightIsHere && <Knight />}
    </UI.Box>
  );
};

const Board: React.FC = () => {
  return (
    <UI.SimpleGrid columns={8} width={320}>
      {_.times(64, (i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        return <BoardSquare key={i} pos={{ x, y }} />;
      })}
    </UI.SimpleGrid>
  );
};

/**
 * A component for ALL drag and drop previews.
 * It can render different things based on the item type.
 */
const CustomDragLayer: React.FC = () => {
  const dragLayer = useCustomDragLayer();

  if (!dragLayer.isOffset) {
    return null;
  }

  const transform = `translate(${dragLayer.currentOffset?.x}px, ${dragLayer.currentOffset?.y}px)`;

  return (
    <UI.Box
      position="fixed"
      pointerEvents="none"
      zIndex={100}
      left={0}
      top={0}
      width="100%"
      height="100%"
      transform={transform}
    >
      {dragLayer.itemType === ItemTypes.KNIGHT && <Knight />}
    </UI.Box>
  );
};

const DragAndDropExample: React.FC = () => {
  return (
    <DnDMultiProvider>
      <ChessState.Provider value={null}>
        <Board />
        <CustomDragLayer />
      </ChessState.Provider>
    </DnDMultiProvider>
  );
};

export default DragAndDropExample;
