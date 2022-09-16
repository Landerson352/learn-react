import React from 'react';
import * as UI from '@chakra-ui/react';
import _ from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
import useDoubleClick from 'use-double-click';

import { NonScrollingFlex } from './NonScrollingFlex';
import { ItemTypes, Tile, GameState, boardSize, traySize } from './game';
import CustomDragLayer from '../dnd/dnd-helpers/CustomDragLayer';
import DndMultiProvider from '../dnd/dnd-helpers/DndMultiProvider';
import { useDisableNativePreview } from '../dnd/dnd-helpers/hooks';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const TileView: React.FC<{ tile: Tile; isDragLayer?: boolean } & UI.BoxProps> =
  ({ tile, isDragLayer, ...boxProps }) => {
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
        top={isDragLayer ? '-20px' : 0}
        transform={isDragLayer ? 'scale(0.95)' : ''}
        {...boxProps}
      >
        {/* <UI.Flex
          alignItems="end"
          justifyContent="space-between"
          w="80px"
          h="100px"
          borderRadius="lg"
          bg="gray.600"
          position="absolute"
          top={0}
          left={0}
          visibility={isDragLayer ? 'visible' : 'hidden'}
          px={1}
          fontSize="8px"
          color="gray.600"
        >
          <UI.HStack spacing="2px" px={1} py="5px">
            {_.map(tile.mods, (mod, key) => {
              if (mod.value <= 0) return null;

              return (
                <React.Fragment key={key}>
                  {_.times(mod.value, (i) => {
                    return (
                      <UI.Box
                        key={i}
                        bg={mod.color.hex}
                        borderRadius="2px"
                        w={3}
                        h={3}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </UI.Box>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </UI.HStack>
          <UI.HStack spacing="2px" px={1} py="5px">
            {_.map(tile.mods, (mod, key) => {
              if (mod.value >= 0) return null;

              return (
                <React.Fragment key={key}>
                  {_.times(-mod.value, (i) => {
                    return (
                      <UI.Box
                        key={i}
                        bg={mod.color.hex}
                        borderRadius="2px"
                        w={3}
                        h={3}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </UI.Box>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </UI.HStack>
        </UI.Flex> */}
        <UI.Box
          w="80px"
          h="80px"
          borderRadius="lg"
          // bg={tile.color.hex}
          bg="orange.300"
          // color="gray.200"
          position="absolute"
          top={0}
          left={0}
        >
          <UI.Box
            ref={buttonRef}
            fontWeight="bold"
            fontSize="lg"
            lineHeight="80px"
          >
            {/* {tile.id} */}
          </UI.Box>
        </UI.Box>

        <UI.Box
          w="80px"
          h="80px"
          borderRadius="lg"
          // bg={tile.color.hex}
          bg="green.500"
          color="gray.200"
          position="absolute"
          top={-1}
          left={0}
        />
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

  const dropZoneColor =
    dropState.isOver && dropState.canDrop
      ? mode === 'tray'
        ? 'gray.300'
        : 'green.400'
      : 'transparent';

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
      templateAreas="main"
      alignItems="center"
      justifyItems="center"
      {...gridProps}
    >
      <UI.Box
        gridArea="main"
        borderRadius="full"
        // bg={mode === 'tray' ? 'gray.400' : 'gray.100'}
        border="2px solid"
        borderColor={mode === 'tray' ? 'gray.300' : 'blue.400'}
        w={6}
        h={6}
        m={1}
        opacity={1}
        // boxShadow="inset 0 10px 20px rgba(0, 0, 0, 0.15)"
      />
      <UI.Box
        gridArea="main"
        borderRadius="lg"
        border="2px dashed"
        dash
        borderColor={dropZoneColor}
        w="76px"
        h="76px"
        m={1}
        transition="all 0.15s"
      />
      <UI.Box
        gridArea="main"
        borderRadius="md"
        bg={dropZoneColor}
        w="68px"
        h="68px"
        m={1}
        opacity={0.3}
        transition="all 0.15s"
      />
      {tile ? <TileView gridArea="main" zIndex={1} tile={tile} /> : null}
    </UI.Grid>
  );
};

const Score: React.FC = () => {
  const game = GameState.useContext();

  return (
    <UI.Box>
      <UI.Text>{game.score}</UI.Text>
    </UI.Box>
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
            justifyContent="center"
            userSelect="none"
          >
            <Score />
          </NonScrollingFlex.Child>
          <NonScrollingFlex.Child
            flex="1 0 auto"
            alignItems="center"
            justifyContent="end"
            userSelect="none"
            bg="blue.600"
          >
            <UI.Box w="360px" h="360px" p="20px" pt="30px">
              <UI.SimpleGrid columns={4} spacing={0}>
                {_.times(boardSize, (i) => (
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
                  {_.times(traySize, (i) => (
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
              <TileView isDragLayer tile={dragLayer.item} />
            ) : null;
          }}
        </CustomDragLayer>
      </GameState.Provider>
    </DndMultiProvider>
  );
};
