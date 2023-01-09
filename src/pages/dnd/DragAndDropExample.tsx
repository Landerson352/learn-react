import * as UI from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { ChessState, ItemTypes, KnightPosition } from './chess';
import CustomDragLayer from './dnd-helpers/CustomDragLayer';
import DndMultiProvider from './dnd-helpers/DndMultiProvider';
import { useDisableNativePreview } from './dnd-helpers/hooks';

/**
 * Adapted from https://react-dnd.github.io/react-dnd/docs/tutorial
 *
 * In this example, we use our chess app logic and dnd helpers
 * to create a drag-and drop interface.
 */

const Knight: React.FC = () => {
  // Inform dnd that we can drag this knight
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.KNIGHT,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  useDisableNativePreview(preview);

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
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
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
    <UI.SimpleGrid columns={8} width={320} m={10}>
      {_.times(64, (i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        return <BoardSquare key={i} pos={{ x, y }} />;
      })}
    </UI.SimpleGrid>
  );
};

const DragAndDropExample: React.FC = () => {
  return (
    <DndMultiProvider>
      <ChessState.Provider value={null}>
        <Board />
        <CustomDragLayer>
          {(dragLayer) => {
            return dragLayer.itemType === ItemTypes.KNIGHT ? <Knight /> : null;
          }}
        </CustomDragLayer>
      </ChessState.Provider>
    </DndMultiProvider>
  );
};

export default DragAndDropExample;
