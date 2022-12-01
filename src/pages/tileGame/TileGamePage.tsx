import React from 'react';
import * as UI from '@chakra-ui/react';
import _ from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
import useDoubleClick from 'use-double-click';
// import { useLongPress } from 'use-long-press';
// import { useClickAway } from 'react-use';
import * as FramerMotion from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faMale,
  faHeart,
  faArrowsAlt,
} from '@fortawesome/free-solid-svg-icons';

import { NonScrollingFlex } from './NonScrollingFlex';
import { ItemTypes, Tile, GameState, boardSize, traySize } from './game';
import CustomDragLayer from '../dnd/dnd-helpers/CustomDragLayer';
import DndMultiProvider from '../dnd/dnd-helpers/DndMultiProvider';
import { useDisableNativePreview } from '../dnd/dnd-helpers/hooks';
// import { useRendersCount } from 'react-use';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const MotionUI = {
  Box: FramerMotion.motion(UI.Box),
};

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
  // const rendersCount = useRendersCount();
  // const [isOpen, setIsOpen] = React.useState(false);
  // const longPressProps = useLongPress(() => setIsOpen(true))();

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
      // top={isDragLayer ? '-20px' : 0}
      transform={isDragLayer ? 'scale(1.05)' : ''}
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
        key="edge"
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
        key="surface"
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

      <UI.Flex
        key="tooltip"
        w="108px"
        h="40px"
        borderRadius="lg"
        // bg="pink"
        position="absolute"
        top="-50px"
        left="-14px"
        pointerEvents="none"
        bg="white"
        opacity={isDragLayer || mode === 'tray' ? 1 : 0}
        // opacity={isDragLayer ? 0 : Math.min(1, rendersCount)}
        // animate={{ opacity: isDragLayer ? 1 : 0 }}
        // transition={{ duration: 0.6 }}
        alignItems="center"
        justifyContent="center"
      >
        <UI.HStack>
          <UI.HStack spacing="2px" color="orange.200" fontWeight="bold">
            <FontAwesomeIcon icon={faCircle} />
            <UI.Text color="orange.400">5</UI.Text>
          </UI.HStack>
          {/* <UI.HStack spacing="2px" color="green.300" fontWeight="bold">
            <FontAwesomeIcon icon={faMale} />
            <UI.Text color="green.500">1</UI.Text>
          </UI.HStack> */}
          <UI.HStack spacing="2px" color="red.300" fontWeight="bold">
            <FontAwesomeIcon icon={faHeart} />
            <FontAwesomeIcon icon={faArrowsAlt} />
            <UI.Text color="red.500">2</UI.Text>
          </UI.HStack>
        </UI.HStack>
      </UI.Flex>
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
        // bg={mode === 'tray' ? 'gray.400' : 'gray.100'}
        border="2px solid"
        borderColor={mode === 'tray' ? 'gray.600' : 'blue.400'}
        w={6}
        h={6}
        // m={1}
        opacity={1}
        // boxShadow="inset 0 10px 20px rgba(0, 0, 0, 0.15)"
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
        <TileView mode={mode} gridArea="main" zIndex={1} tile={tile} />
      ) : null}
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
          {/* <NonScrollingFlex.Child
            flex="1 0 auto"
            alignItems="center"
            justifyContent="center"
            userSelect="none"
          >
            <Score />
          </NonScrollingFlex.Child> */}
          <NonScrollingFlex.Child
            flex="1 0 auto"
            alignItems="center"
            justifyContent="center"
            userSelect="none"
            bg="blue.600"
          >
            <TileSlotGrid>
              {_.times(boardSize, (i) => (
                <TileSlot key={i} index={i} />
              ))}
            </TileSlotGrid>
          </NonScrollingFlex.Child>
          <NonScrollingFlex.Child
            flex="1 0 auto"
            alignItems="center"
            justifyContent="center"
            userSelect="none"
            bg="gray.800"
          >
            {/* <UI.Flex
              direction="column"
              w="360px"
              h="380px"
              flex="0 1 auto"
              p="10px"
              pb="30px"
              overflow="hidden"
            > */}
            {/* <UI.Box
                bg="gray.400"
                flex="1 1 0"
                p="10px"
                borderRadius="lg"
                overflow="scroll"
                boxShadow="inset 0 10px 20px rgba(0, 0, 0, 0.15)"
              > */}
            {/* <UI.SimpleGrid columns={4} spacing={0}> */}
            <UI.HStack spacing={0} pt="50px">
              {_.times(traySize, (i) => (
                <TileSlot
                  key={i}
                  mode="tray"
                  index={i + boardSize}
                  // transform="scale(0.875)"
                  w="104px"
                />
              ))}
            </UI.HStack>
            {/* </UI.SimpleGrid> */}
            {/* </UI.Box> */}
            {/* </UI.Flex> */}
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
