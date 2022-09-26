import React from 'react';
import _ from 'lodash';

import createContextProvider from '../../helpers/createContextProvider';
import { immutablySwapItems } from '../../helpers/immutablySwapItems';

export const boardSize = 16;
export const traySize = 3;

export enum ItemTypes {
  tile = 'tile',
}

// export interface TileColor {
//   hex: string;
// }

// export const tileColors: { [key: string]: TileColor } = {
//   grass: { hex: 'green.300' },
//   snow: { hex: 'gray.100' },
//   sand: { hex: 'orange.300' },
//   asphalt: { hex: 'gray.700' },
//   concrete: { hex: 'gray.500' },
//   forest: { hex: 'green.500' },
// };

// export type TileColorKey = keyof typeof tileColors;

export interface Tile {
  id: number;
  // color: TileColor;
  // mods?: TileColorMods;
  buildingLevel?: number;
  natureLevel?: number;
  animalLevel?: number;
}

export type TilePosition = Tile | null;

// export interface TileColorMod {
//   color: TileColor;
//   value: number;
// }

// export interface TileColorMods {
//   [key: TileColorKey]: TileColorMod;
// }

// const getRandomColor = (): TileColor => {
//   return _.sample(Object.values(tileColors)) as TileColor;
// };

// const getRandomColorMods = (): TileColorMods => {
//   const mods = _.mapValues(tileColors, (color) => {
//     return {
//       color,
//       value: 0,
//     };
//   });

//   for (let i = 0; i < 4; i++) {
//     let color = _.sample(mods) as TileColorMod;
//     color.value += _.sample([-1, 0, 0, 1, 1, 1]) as number;
//   }

//   return mods;
// };

const getInitialTiles = (): TilePosition[] => {
  return [
    ..._.times(boardSize, () => null),
    ..._.times(traySize, (i) => {
      // return { id: i, color: getRandomColor(), mods: getRandomColorMods() };
      // TODO: random levels
      return { id: i };
    }),
  ];
};

const getTileToTileScore = (
  tile: TilePosition,
  tiles: TilePosition[],
  index: number
): number => {
  if (tile === null || index < 0 || index >= boardSize) {
    return 0;
  }
  const otherTile = tiles[index];
  if (!otherTile) {
    return 0;
  }
  // TODO: add adjacent tile levels
  const score = 1;
  // const score = _.reduce(
  //   tile.mods,
  //   (acc, mod) => {
  //     if (mod.color === otherTile.color) {
  //       return acc + mod.value;
  //     }
  //     return acc;
  //   },
  //   0
  // );

  return score;
};

const getTileScore = (tiles: TilePosition[], index: number): number => {
  const tile = tiles[index];
  if (!tile) {
    return 0;
  }

  let score = 1;
  score += getTileToTileScore(tile, tiles, index - 5);
  score += getTileToTileScore(tile, tiles, index - 4);
  score += getTileToTileScore(tile, tiles, index - 3);
  score += getTileToTileScore(tile, tiles, index - 1);
  score += getTileToTileScore(tile, tiles, index + 1);
  score += getTileToTileScore(tile, tiles, index + 3);
  score += getTileToTileScore(tile, tiles, index + 4);
  score += getTileToTileScore(tile, tiles, index + 5);

  return score;
};

const getScore = (tiles: TilePosition[]): number => {
  let score = 0;
  for (let i = 0; i < boardSize; i++) {
    score += getTileScore(tiles, i);
  }
  return score;
};

export const GameState = createContextProvider(() => {
  const [tiles, setTiles] = React.useState<TilePosition[]>(getInitialTiles());

  const score = getScore(tiles);

  const canMoveTile = (tile: Tile, toIndex: number) => {
    // TODO: immovable tiles
    return true;
  };

  const moveTile = (tile: Tile, toIndex: number) => {
    if (canMoveTile(tile, toIndex)) {
      setTiles((tiles) => {
        return immutablySwapItems(tiles, tiles.indexOf(tile), toIndex);
      });
    }
  };

  return {
    tiles,
    score,
    canMoveTile,
    moveTile,
  };
});
