import React from 'react';
import * as UI from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useHoverDirty } from 'react-use';

import createContextProvider from '../helpers/createContextProvider';

export enum CardShowing {
  Face = 'face',
  Back = 'back',
}

export enum CardDimension {
  Width = 150,
  Height = 212,
}

export type CardHoverStyle = 'discard';

export interface Card {
  id: string;
  showing?: CardShowing;
}

export const CardTheme = createContextProvider(
  (props: { faceRenderer: CardRenderer; backRenderer: CardRenderer }) => {
    return props;
  }
);

export const CardContainer: React.FC<UI.BoxProps> = (props) => {
  return (
    <UI.Stack
      direction="row"
      flexGrow={1}
      p={4}
      bg="gray.600"
      borderRadius={20}
      border="2px dashed"
      borderColor="gray.500"
      flexShrink={0}
      {...props}
    />
  );
};

export type CardBoxProps = UI.BoxProps | UI.SimpleGridProps | UI.StackProps;

export const CardBox = React.forwardRef<HTMLDivElement, CardBoxProps>(
  (props, ref) => {
    return (
      <UI.Box
        ref={ref}
        direction="row"
        w={`${CardDimension.Width}px`}
        h={`${CardDimension.Height}px`}
        {...props}
      />
    );
  }
);

export type CardRenderer = (card: Card) => React.ReactNode;

export type CardViewProps = CardBoxProps & {
  card: Card;
  showing?: CardShowing;
  hoverStyle?: CardHoverStyle;
};

export const CardView: React.FC<CardViewProps> = ({
  card,
  showing,
  hoverStyle,
  ...boxProps
}) => {
  const { faceRenderer, backRenderer } = CardTheme.useContext();
  const boxRef = React.useRef<HTMLDivElement>(null);
  const isHovered = useHoverDirty(boxRef);
  const isShowing = showing === undefined ? card.showing : showing;

  return (
    <CardBox
      ref={boxRef}
      as="button"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      sx={{
        '>*': { flexGrow: 1 },
      }}
      position="relative"
      bg="white"
      color="black"
      borderRadius={8}
      overflow="hidden"
      shadow="2px 2px 2px rgba(0, 0, 0, 0.25)"
      transition="all 0.1s ease-in-out"
      outline="0 solid"
      outlineColor="green.400"
      outlineOffset="-3px"
      _hover={{
        outline: '3px solid black',
        outlineOffset: '2px',
      }}
      pointerEvents={boxProps.onClick ? undefined : 'none'}
      {...boxProps}
    >
      {isShowing === CardShowing.Face ? faceRenderer(card) : backRenderer(card)}
      {hoverStyle === 'discard' && isHovered ? (
        <UI.Flex
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          left={0}
          alignItems="center"
          justifyContent="center"
          color="white"
          bg="rgba(255,0,0,0.65)"
          fontSize="48px"
          pointerEvents="none"
        >
          <FontAwesomeIcon icon={faTimes} />
        </UI.Flex>
      ) : null}
    </CardBox>
  );
};

type CardListComponent<K = {}> = <T extends Card>(
  props: {
    cards: T[];
    showing?: CardShowing;
    onCardClick?: (card: T) => void;
    hoverStyle?: CardHoverStyle;
  } & K
) => React.ReactElement;

export const CardStack: CardListComponent = ({
  cards,
  showing,
  onCardClick,
  hoverStyle,
}) => {
  const maxDisplay = 5;
  const displayedCards = cards.slice(-maxDisplay);

  return (
    <CardContainer>
      <CardBox position="relative">
        {displayedCards.map((card, i) => {
          const isLast = i === displayedCards.length - 1;
          return (
            <CardView
              key={card.id}
              card={card}
              showing={showing}
              position="absolute"
              top={`${i * -3}px`}
              left={`${i * -3}px`}
              hoverStyle={hoverStyle}
              onClick={
                isLast && onCardClick ? () => onCardClick(card) : undefined
              }
            />
          );
        })}
      </CardBox>
    </CardContainer>
  );
};

export const CardRow: CardListComponent = ({
  cards,
  showing,
  onCardClick,
  hoverStyle,
}) => {
  return (
    <CardContainer overflow="scroll">
      <CardBox as={UI.Stack} width="auto">
        {cards.map((card, i) => {
          return (
            <CardView
              key={card.id}
              card={card}
              showing={showing}
              hoverStyle={hoverStyle}
              onClick={onCardClick ? () => onCardClick(card) : undefined}
            />
          );
        })}
      </CardBox>
    </CardContainer>
  );
};

export const CardGrid: CardListComponent<
  UI.SimpleGridProps & {
    columns?: number;
    rows?: number;
  }
> = ({
  cards,
  showing,
  columns = 10,
  rows = 1,
  children,
  onCardClick,
  hoverStyle,
  ...gridProps
}) => {
  return (
    <CardContainer overflow="scroll">
      <UI.SimpleGrid
        gridTemplateColumns={`repeat(${columns}, ${CardDimension.Width}px)`}
        gridTemplateRows={`repeat(${rows}, ${CardDimension.Height}px)`}
        spacing={2}
        autoFlow="row"
        {...gridProps}
      >
        {cards.map((card, i) => {
          return (
            <CardView
              key={card.id}
              card={card}
              showing={showing}
              flexShrink={0}
              hoverStyle={hoverStyle}
              onClick={onCardClick ? () => onCardClick(card) : undefined}
            />
          );
        })}
      </UI.SimpleGrid>
    </CardContainer>
  );
};
