import React from 'react';
import _ from 'lodash';

import createContextProvider from '../../helpers/createContextProvider';
import { immutablySwapItems } from '../../helpers/immutablySwapItems';

export const boardSize = 16;
export const traySize = 16;

export enum ItemTypes {
  tile = 'tile',
}

export interface Tile {
  id: number;
}

export type TilePosition = Tile | null;

const getInitialTiles = (): TilePosition[] => {
  return [
    ..._.times(boardSize, () => null),
    ..._.times(traySize, (i) => {
      return { id: i };
    }),
  ];
};

export const GameState = createContextProvider(() => {
  const [tiles, setTiles] = React.useState<TilePosition[]>(getInitialTiles());

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
    canMoveTile,
    moveTile,
  };
});
