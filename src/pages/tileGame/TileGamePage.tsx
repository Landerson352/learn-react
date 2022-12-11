import React from 'react';
import * as UI from '@chakra-ui/react';
import _ from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
import useDoubleClick from 'use-double-click';
// import * as FramerMotion from 'framer-motion';

import { NonScrollingFlex } from './NonScrollingFlex';
import { ItemTypes, Tile, GameState, boardSize, traySize } from './game';
import CustomDragLayer from '../dnd/dnd-helpers/CustomDragLayer';
import DndMultiProvider from '../dnd/dnd-helpers/DndMultiProvider';
import { useDisableNativePreview } from '../dnd/dnd-helpers/hooks';

// const MotionUI = {
//   Box: FramerMotion.motion(UI.Box),
// };

const TileView: React.FC<
  { tile: Tile; isDragLayer?: boolean; mode?: 'board' | 'tray' } & UI.BoxProps
> = ({ tile, isDragLayer, mode, ...boxProps }) => {
  // Inform dnd that we can drag this tile
  const [{ isDragging }, drag, preview] = useDrag(
    {
      type: ItemTypes.tile,
      item: tile,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [tile]
  );
  useDisableNativePreview(preview);
  const buttonRef = React.useRef<HTMLDivElement | null>(null);
  useDoubleClick({
    onSingleClick: (e) => {
      console.log('single click');
    },
    onDoubleClick: (e) => {
      console.log('double click');
    },
    ref: buttonRef,
  });

  return (
    <UI.Box
      ref={drag}
      as="button"
      w="80px"
      h="80px"
      borderRadius="lg"
      position="relative"
      opacity={isDragging ? 0 : 1}
      cursor="grab"
      sx={{
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      }}
      boxShadow={isDragLayer ? 'dark-lg' : ''}
      transform={isDragLayer ? 'scale(1.05)' : ''}
      {...boxProps}
    >
      <UI.Box
        key="edge"
        w="80px"
        h="80px"
        borderRadius="lg"
        bg="orange.400"
        border="2px solid"
        borderColor="orange.500"
        borderLeftColor="orange.300"
        position="absolute"
        top={0}
        left={0}
      >
        <UI.Box
          ref={buttonRef}
          fontWeight="bold"
          fontSize="lg"
          lineHeight="80px"
        />
      </UI.Box>

      <UI.Box
        key="surface"
        w="80px"
        h="80px"
        borderRadius="md"
        bg="green.500"
        border="2px solid"
        borderColor="green.400"
        borderRightColor="green.600"
        borderBottomColor="green.600"
        color="gray.200"
        position="absolute"
        top={-2}
        left={0}
      />
    </UI.Box>
  );
};

const slotSize = 80;
const dropZoneSize = 84;
const dropZoneBorderSize = dropZoneSize + 8;

const TileSlotGrid: React.FC<
  { columns?: number } & Omit<UI.SimpleGridProps, 'columns'>
> = ({ columns = 4, ...restProps }) => {
  return (
    <UI.SimpleGrid
      columns={columns}
      spacing={0}
      w={`${slotSize * columns}px`}
      h={`${slotSize * columns}px`}
      {...restProps}
    />
  );
};

const TileSlot: React.FC<
  { index: number; mode?: 'board' | 'tray' } & UI.GridProps
> = ({ index, mode = 'board', ...gridProps }) => {
  const game = GameState.useContext();
  // Inform dnd that we can (sometimes) drop a tile on this square
  const [dropState, drop] = useDrop(
    {
      accept: ItemTypes.tile,
      canDrop: (item: Tile) => game.canMoveTile(item, index),
      drop: (item: Tile) => game.moveTile(item, index),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    },
    [index, game.canMoveTile, game.moveTile]
  );

  const tile = game.tiles[index];

  const dropZoneColor =
    dropState.isOver && dropState.canDrop
      ? mode === 'tray'
        ? 'yellow.400' // 'gray.600'
        : 'yellow.400' // 'green.400'
      : 'transparent';

  return (
    <UI.Grid
      ref={drop}
      w={`${slotSize}px`}
      h={`${slotSize}px`}
      sx={{
        '>*': {
          flexShrink: 0,
          flexGrow: 0,
        },
      }}
      templateRows="1fr"
      templateColumns="1fr"
      templateAreas={'"main"'}
      alignItems="center"
      justifyItems="center"
      {...gridProps}
    >
      <UI.Box
        key="dot"
        gridArea="main"
        borderRadius="full"
        border="2px solid"
        borderColor={mode === 'tray' ? 'gray.600' : 'blue.400'}
        w={6}
        h={6}
        opacity={1}
      />
      <UI.Box
        key="drop-highlight-border"
        gridArea="main"
        borderRadius="lg"
        border="2px dashed"
        dash
        borderColor={dropZoneColor}
        w={`${dropZoneBorderSize}px`}
        h={`${dropZoneBorderSize}px`}
        m={`${dropZoneBorderSize / -2}px`}
        transition="all 0.3s"
        position="relative"
        zIndex={2}
        pointerEvents="none"
      />
      <UI.Box
        key="drop-highlight-bg"
        gridArea="main"
        borderRadius="md"
        bg={dropZoneColor}
        w={`${dropZoneSize}px`}
        h={`${dropZoneSize}px`}
        m={`${dropZoneSize / -2}px`}
        opacity={0.3}
        transition="all 0.1s"
        position="relative"
        zIndex={2}
        pointerEvents="none"
      />
      {tile ? (
        <TileView
          mode={mode}
          gridArea="main"
          zIndex={1}
          tile={tile}
          transform={mode === 'tray' ? 'scale(0.9)' : undefined}
        />
      ) : null}
    </UI.Grid>
  );
};

// const Score: React.FC<UI.TextProps> = (props) => {
//   const game = GameState.useContext();

//   return (
//     <UI.Heading color="blue.200" {...props}>
//       {game.score}
//     </UI.Heading>
//   );
// };

const StrayDropsCatcher: React.FC<{ accept: string }> = ({ accept }) => {
  const [, bodyDropRef] = useDrop(() => ({
    accept,
    drop: () => {
      // do nothing
    },
  }));

  React.useEffect(() => {
    bodyDropRef(document.body);
    return () => {
      bodyDropRef(null);
    };
  }, [bodyDropRef]);

  return null;
};

export const TileGamePage: React.FC = () => {
  return (
    <DndMultiProvider>
      <StrayDropsCatcher accept={ItemTypes.tile} />
      <GameState.Provider value={null}>
        <NonScrollingFlex.Root>
          <NonScrollingFlex.Child
            flex="1 0 auto"
            alignItems="center"
            justifyContent="end"
            userSelect="none"
            bg="blue.600"
            p={4}
            py={8}
          >
            {/* <Score mb={6} /> */}
            <TileSlotGrid>
              {_.times(boardSize, (i) => (
                <TileSlot key={i} index={i} />
              ))}
            </TileSlotGrid>
          </NonScrollingFlex.Child>
          <NonScrollingFlex.Child
            flex="1 1 auto"
            alignItems="center"
            justifyContent="start"
            userSelect="none"
            bg="gray.800"
            overflow="scroll"
            p={4}
            py={8}
          >
            <UI.SimpleGrid columns={4} spacing={0}>
              {_.times(traySize, (i) => (
                <TileSlot key={i} mode="tray" index={i + boardSize} />
              ))}
            </UI.SimpleGrid>
          </NonScrollingFlex.Child>
        </NonScrollingFlex.Root>
        <CustomDragLayer>
          {(dragLayer) => {
            return dragLayer.itemType === ItemTypes.tile ? (
              <TileView isDragLayer tile={dragLayer.item} />
            ) : null;
          }}
        </CustomDragLayer>
      </GameState.Provider>
    </DndMultiProvider>
  );
};
