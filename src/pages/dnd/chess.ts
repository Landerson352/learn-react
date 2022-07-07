import React from 'react';
import _ from 'lodash';

import createContextProvider from '../../helpers/createContextProvider';

/**
 * In this example the application types, state and logic is stored in a single file.
 */

export enum ItemTypes {
  KNIGHT = 'knight',
}

export interface KnightPosition {
  x: number;
  y: number;
}

export const canMoveKnight = (from: KnightPosition, to: KnightPosition) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  return (
    (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
    (Math.abs(dx) === 1 && Math.abs(dy) === 2)
  );
};

export const ChessState = createContextProvider(() => {
  const [knightPosition, setKnightPosition] = React.useState<KnightPosition>({
    x: 0,
    y: 0,
  });

  const canMoveKnightTo = (to: KnightPosition) => {
    return canMoveKnight(knightPosition, to);
  };

  const moveKnightTo = (to: KnightPosition) => {
    if (canMoveKnightTo(to)) {
      setKnightPosition(to);
    }
  };

  const knightIsAt = (position: KnightPosition) => {
    return _.isEqual(knightPosition, position);
  };

  return {
    knightPosition,
    knightIsAt,
    canMoveKnightTo,
    moveKnightTo,
  };
});
