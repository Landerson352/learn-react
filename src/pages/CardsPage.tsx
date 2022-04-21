import React from 'react';
import * as UI from '@chakra-ui/react';

import {
  CardShowing,
  CardRenderer,
  CardTheme,
  CardGrid,
  CardRow,
  CardStack,
} from '../cards';

const CardsPage: React.FC = () => {
  const cards = [
    { id: '1' },
    { id: '2', showing: CardShowing.Face },
    { id: '3', showing: CardShowing.Back },
    { id: '4', showing: CardShowing.Face },
    { id: '5', showing: CardShowing.Back },
  ];

  const faceRenderer: CardRenderer = (card) => card.id;
  const backRenderer: CardRenderer = () => 'BACK';

  return (
    <UI.Box p="4">
      <UI.Stack>
        <CardTheme.Provider value={{ faceRenderer, backRenderer }}>
          <CardGrid columns={4} rows={2} cards={cards} />
          <CardRow cards={[]} />
          <CardRow cards={cards} />
          <CardRow cards={cards} showing={CardShowing.Face} />
          <CardRow cards={cards} showing={CardShowing.Back} />
          <UI.Stack direction="row">
            <CardStack cards={[]} />
            <CardStack cards={cards} />
            <CardStack cards={cards} showing={CardShowing.Face} />
            <CardStack cards={cards} showing={CardShowing.Back} />
          </UI.Stack>
        </CardTheme.Provider>
      </UI.Stack>
    </UI.Box>
  );
};

export default CardsPage;
