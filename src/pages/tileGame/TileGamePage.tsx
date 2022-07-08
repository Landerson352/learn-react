import React from 'react';
import * as UI from '@chakra-ui/react';
import _ from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
import useDoubleClick from 'use-double-click';

import { NonScrollingFlex } from './NonScrollingFlex';
import { ItemTypes, Tile, GameState, boardSize } from './game';
import CustomDragLayer from '../dnd/dnd-helpers/CustomDragLayer';
import DndMultiProvider from '../dnd/dnd-helpers/DndMultiProvider';
import { useDisableNativePreview } from '../dnd/dnd-helpers/hooks';

const TileView: React.FC<{ tile: Tile } & UI.BoxProps> = ({
  tile,
  ...boxProps
}) => {
  // Inform dnd that we can drag this tile
  const [{ isDragging }, drag, preview] = useDrag(
    {
      type: ItemTypes.tile,
      item: tile,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      // options: {
      //   dropEffect: 'grabbing',
      // },
    },
    [tile]
  );
  useDisableNativePreview(preview);
  const buttonRef = React.useRef<HTMLDivElement | null>(null);
  useDoubleClick({
    onDoubleClick: (e) => {
      window.alert('double click');
    },
    ref: buttonRef,
  });

  return (
    <UI.Box
      ref={drag}
      as="button"
      w="80px"
      h="80px"
      bg="gray.500"
      color="gray.200"
      fontWeight="bold"
      fontSize="lg"
      borderRadius="md"
      opacity={isDragging ? 0 : 1}
      cursor="grab"
      sx={{
        '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
      }}
      {...boxProps}
    >
      <UI.Box ref={buttonRef} lineHeight="80px">
        {tile.id}
      </UI.Box>
    </UI.Box>
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

  return (
    <UI.Grid
      ref={drop}
      w="80px"
      h="80px"
      sx={{
        '>*': {
          flexShrink: 0,
          flexGrow: 0,
        },
      }}
      templateRows="1fr"
      templateColumns="1fr"
      templateAreas={`"main"`}
      alignItems="center"
      justifyItems="center"
      {...gridProps}
    >
      <UI.Box
        gridArea="main"
        borderRadius="full"
        bg="gray.700"
        w={6}
        h={6}
        m={1}
        opacity={0.25}
      />
      <UI.Box
        gridArea="main"
        borderRadius="md"
        border="2px dashed"
        borderColor={
          dropState.isOver && dropState.canDrop
            ? mode === 'tray'
              ? 'white'
              : 'green.400'
            : 'transparent'
        }
        w="76px"
        h="76px"
        m={1}
      />
      {tile ? <TileView gridArea="main" zIndex={1} tile={tile} /> : null}
    </UI.Grid>
  );
};

export const TileGamePage: React.FC = () => {
  return (
    <DndMultiProvider>
      <GameState.Provider value={null}>
        <NonScrollingFlex.Root>
          <NonScrollingFlex.Child
            flex="1 0 auto"
            alignItems="center"
            justifyContent="end"
            userSelect="none"
          >
            <UI.Box w="360px" h="360px" p="20px" pt="30px">
              <UI.SimpleGrid columns={4} spacing={0}>
                {_.times(16, (i) => (
                  <TileSlot key={i} index={i} />
                ))}
              </UI.SimpleGrid>
            </UI.Box>
          </NonScrollingFlex.Child>
          <NonScrollingFlex.Child
            flex="1 1 auto"
            alignItems="center"
            justifyContent="start"
            userSelect="none"
          >
            <UI.Flex
              direction="column"
              w="360px"
              h="380px"
              flex="0 1 auto"
              p="10px"
              pb="30px"
              overflow="hidden"
            >
              <UI.Box
                bg="gray.400"
                flex="1 1 0"
                p="10px"
                borderRadius="lg"
                overflow="scroll"
                boxShadow="inset 0 10px 20px rgba(0, 0, 0, 0.15)"
              >
                <UI.SimpleGrid columns={4} spacing={0}>
                  {_.times(16, (i) => (
                    <TileSlot
                      key={i}
                      mode="tray"
                      index={i + boardSize}
                      transform="scale(0.875)"
                    />
                  ))}
                </UI.SimpleGrid>
              </UI.Box>
            </UI.Flex>
          </NonScrollingFlex.Child>
        </NonScrollingFlex.Root>
        <CustomDragLayer>
          {(dragLayer) => {
            return dragLayer.itemType === ItemTypes.tile ? (
              <TileView tile={dragLayer.item} />
            ) : null;
          }}
        </CustomDragLayer>
      </GameState.Provider>
    </DndMultiProvider>
  );
};
