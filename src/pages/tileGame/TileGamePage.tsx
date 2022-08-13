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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

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
        {...boxProps}
      >
        <UI.Box
          w="80px"
          h="80px"
          borderRadius="lg"
          bg={tile.color.hex}
          color="gray.200"
          position="absolute"
          top={0}
          left={0}
          // transform={isDragLayer ? 'scale(0.95)' : ''}
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
        bg={mode === 'tray' ? 'gray.400' : 'gray.100'}
        w={6}
        h={6}
        m={1}
        opacity={1}
        boxShadow="inset 0 10px 20px rgba(0, 0, 0, 0.15)"
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

const TileStats: React.FC<{ index: number }> = ({ index }) => {
  const game = GameState.useContext();

  const tile = game.tiles[index];

  const mods = _.reverse(_.sortBy(tile?.mods, ['value', 'color']));

  return (
    <React.Fragment>
      {_.map(mods, (mod, i) => {
        if (mod.value === 0) return null;

        const modValueColor = mod.value > 0 ? 'red.300' : 'yellow.300';
        const modValueIcon = mod.value > 0 ? faHeart : faThumbsDown;
        return (
          <UI.HStack key={i} spacing="6px">
            <UI.HStack color={modValueColor} spacing="1px">
              {_.times(Math.abs(mod.value), (i) => {
                return <FontAwesomeIcon key={i} icon={modValueIcon} />;
              })}
            </UI.HStack>
            <UI.Box w={4} h={4} bg={mod.color.hex} borderRadius="sm" />
          </UI.HStack>
        );
      })}
    </React.Fragment>
  );

  // <UI.HStack spacing="6px">
  //   <UI.HStack color="red.300" spacing="1px">
  //     <FontAwesomeIcon icon={faHeart} />
  //     <FontAwesomeIcon icon={faHeart} />
  //   </UI.HStack>
  //   <UI.Box w={4} h={4} bg="cyan.500" borderRadius="sm" />
  // </UI.HStack>
  // <UI.HStack spacing="6px">
  //   <UI.HStack color="red.300" spacing="1px">
  //     <FontAwesomeIcon icon={faHeart} />
  //   </UI.HStack>
  //   <UI.Box w={4} h={4} bg="purple.500" borderRadius="sm" />
  // </UI.HStack>
  // <UI.HStack spacing="6px">
  //   <UI.HStack color="yellow.300" spacing="1px">
  //     <FontAwesomeIcon icon={faThumbsDown} />
  //   </UI.HStack>
  //   <UI.Box w={4} h={4} bg="orange.500" borderRadius="sm" />
  // </UI.HStack>
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
            flex="0 1 auto"
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
            <UI.HStack
              flex="0 1 auto"
              alignItems="stretch"
              w="360px"
              h="300px"
              p="20px"
              overflow="hidden"
              spacing={0}
            >
              {_.times(traySize, (i) => (
                <UI.VStack key={i} spacing={2}>
                  <TileSlot
                    mode="board"
                    index={i + boardSize}
                    transform="scale(0.875)"
                  />
                  <TileStats index={i + boardSize} />
                  {/* <UI.HStack spacing="6px">
                    <UI.HStack color="red.300" spacing="1px">
                      <FontAwesomeIcon icon={faHeart} />
                      <FontAwesomeIcon icon={faHeart} />
                    </UI.HStack>
                    <UI.Box w={4} h={4} bg="cyan.500" borderRadius="sm" />
                  </UI.HStack>
                  <UI.HStack spacing="6px">
                    <UI.HStack color="red.300" spacing="1px">
                      <FontAwesomeIcon icon={faHeart} />
                    </UI.HStack>
                    <UI.Box w={4} h={4} bg="purple.500" borderRadius="sm" />
                  </UI.HStack>
                  <UI.HStack spacing="6px">
                    <UI.HStack color="yellow.300" spacing="1px">
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </UI.HStack>
                    <UI.Box w={4} h={4} bg="orange.500" borderRadius="sm" />
                  </UI.HStack> */}
                </UI.VStack>
              ))}
            </UI.HStack>
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
