import React from 'react';
import _ from 'lodash';
import * as UI from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faUser,
  faTimes,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';

import createShortCode from '../helpers/createShortCode';
import useCollection from '../helpers/useCollection';
import * as Card from '../cards';

import { Building, City } from '../happy-city/types';
import {
  createMarket,
  createBuildings,
  createResidences,
} from '../happy-city/cards';

const createCities = (numCities: number): City[] => {
  return _.times(numCities, (i) => {
    return {
      id: createShortCode(),
      name: `Player ${i + 1}`,
      coins: 2,
      buildings: [createMarket()],
    };
  });
};

const filterBuildingsByCostTiers = (buildings: Building[]) => {
  const tierCosts = [
    [1, 2, 3],
    [4, 5],
    [6, 7, 8, 9],
  ];

  return tierCosts.map((costs) => {
    return buildings.filter((b) => costs.includes(b.cost));
  });
};

const useHappyCity = (numCities = 3) => {
  const [turnIndex, setTurnIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<
    'draw' | 'discard' | 'buy' | 'game-over'
  >('draw');

  const cities = useCollection(createCities(numCities), 'id');
  const residences = useCollection(createResidences(), 'id');
  const buildings = useCollection(createBuildings(), 'id');
  const buildingsForSale = useCollection([] as Building[], 'id');
  const discardedBuildings = useCollection([] as Building[], 'id');

  // const bonusBuildings = useCollection([] as Building[], 'id');

  const buildingsByCost = filterBuildingsByCostTiers(buildings.items);
  const buildingsForSaleByCost = filterBuildingsByCostTiers(
    buildingsForSale.items
  );
  const discardedBuildingsByCost = filterBuildingsByCostTiers(
    discardedBuildings.items
  );

  const currentCity = cities.items[turnIndex];
  const canDiscard = phase === 'discard';
  const canDraw = phase === 'draw';
  const canBuy = phase === 'buy';
  const canSkipTurn = canBuy;

  const nextTurn = () => {
    const hasLastBuildingBeenPlaced =
      cities.items[turnIndex].buildings.length === 10;
    const nextTurnIndex = (turnIndex + 1) % numCities;
    // TODO: distribute coins
    if (hasLastBuildingBeenPlaced && nextTurnIndex === 0) {
      setPhase('game-over');
    } else {
      setTurnIndex(nextTurnIndex);
      setPhase('discard');
    }
  };

  const drawBuilding = (building: Building) => {
    if (canDraw && buildings.items.includes(building)) {
      buildings.remove(building);
      buildingsForSale.push(building);
      if (buildingsForSale.count + 1 >= 3) {
        setPhase('buy');
      }
    }
  };

  const discardBuildingForSale = (building: Building) => {
    if (canDiscard && buildingsForSale.items.includes(building)) {
      buildingsForSale.remove(building);
      discardedBuildings.push(building);
      setPhase('draw');
    }
  };

  const skipDiscard = () => {
    if (phase === 'discard') {
      if (buildingsForSale.count < 3) {
        setPhase('draw');
      } else {
        setPhase('buy');
      }
    }
  };

  const buyBuilding = (building: Building) => {
    // TODO: bonus building requirements
    // TODO: check if building with the same name is already in city
    if (canBuy && currentCity.coins >= building.cost) {
      buildingsForSale.remove(building);
      cities.patch({
        ...currentCity,
        buildings: [...currentCity.buildings, building],
        coins: currentCity.coins - building.cost,
      });
      nextTurn();
    }
  };

  const skipTurn = () => {
    cities.patch({ ...currentCity, coins: currentCity.coins + 1 });
    nextTurn();
  };

  return {
    residences,
    discardedBuildingsByCost,
    buildingsByCost,
    buildingsForSaleByCost,
    cities,
    currentCity,
    phase,

    canDiscard,
    canDraw,
    canBuy,
    canSkipTurn,

    discardBuildingForSale,
    skipDiscard,
    drawBuilding,
    buyBuilding,
    skipTurn,
  };
};

const faceRenderer: Card.CardRenderer = (card) => {
  const building = card as Building;
  return (
    <UI.Stack spacing={0}>
      <UI.Box h="29px" bg={`${building.color}.50`} />
      <UI.Box h="7px" bg={`${building.color}.100`} />
      <UI.Box flexGrow={1} bg={`${building.color}.400`} />
      <UI.Box h="5px" bg={`${building.color}.100`} />
      <UI.Box h="22px" />

      {building.cost ? (
        <UI.Flex
          bg="yellow.300"
          position="absolute"
          left="9px"
          top="10px"
          w="31px"
          h="31px"
          borderRadius="50%"
          fontWeight="bold"
          fontSize="13px"
          lineHeight="1"
          alignItems="center"
          justifyContent="center"
        >
          {building.cost}
        </UI.Flex>
      ) : null}
      <UI.Flex
        position="absolute"
        left="45px"
        top="8px"
        height="20px"
        direction="column"
        justifyContent="end"
      >
        <UI.Text
          fontWeight="bold"
          fontSize="9px"
          lineHeight="10px"
          textTransform="uppercase"
          textAlign="left"
        >
          {building.name}
        </UI.Text>
      </UI.Flex>
      {building.income ? (
        <UI.Flex
          bg="yellow.300"
          position="absolute"
          left="12px"
          top="168px"
          w="33px"
          h="33px"
          border="2px solid white"
          borderRadius="50%"
          fontWeight="bold"
          fontSize="13px"
          lineHeight="1"
          alignItems="center"
          justifyContent="center"
          transform="rotate(-10deg)"
        >
          {building.income}
          <UI.Box
            position="absolute"
            top="24px"
            left="15px"
            transform="rotate(-20deg)"
          >
            <FontAwesomeIcon icon={faArrowDown} color="black" />
          </UI.Box>
        </UI.Flex>
      ) : null}
      {building.citizens ? (
        <UI.Stack
          direction="row"
          spacing={-4}
          position="absolute"
          right="10px"
          top="179px"
          h="26px"
          fontSize="26px"
          color="green.400"
        >
          {_.times(Math.abs(building.citizens), (i) => (
            <span className="fa-layers fa-fw" key={i}>
              <FontAwesomeIcon
                icon={faUser}
                style={{
                  stroke: 'white',
                  strokeWidth: '30px',
                }}
              />
              {(building?.citizens || 0) < 0 ? (
                <FontAwesomeIcon icon={faTimes} color="black" size="xs" />
              ) : null}
            </span>
          ))}
        </UI.Stack>
      ) : null}
      {building.hearts ? (
        <UI.Stack
          direction="row"
          spacing={-2}
          position="absolute"
          right="10px"
          top="179px"
          h="26px"
          fontSize="26px"
          color="red.400"
        >
          {_.times(Math.abs(building.hearts), (i) => (
            <span className="fa-layers fa-fw" key={i}>
              <FontAwesomeIcon
                icon={faHeart}
                style={{
                  stroke: 'white',
                  strokeWidth: '30px',
                }}
              />
              {(building?.hearts || 0) < 0 ? (
                <FontAwesomeIcon icon={faTimes} color="black" size="xs" />
              ) : null}
            </span>
          ))}
        </UI.Stack>
      ) : null}
    </UI.Stack>
  );
};
const backRenderer: Card.CardRenderer = () => {
  return <UI.Box bg="blue.800" />;
};

const HappyCityPage: React.FC = () => {
  const {
    residences,
    discardedBuildingsByCost,
    buildingsByCost,
    buildingsForSaleByCost,
    cities,
    currentCity,
    phase,

    canDiscard,
    canDraw,
    canBuy,
    canSkipTurn,

    discardBuildingForSale,
    skipDiscard,
    drawBuilding,
    buyBuilding,
    skipTurn,
  } = useHappyCity();

  return (
    <Card.CardTheme.Provider value={{ faceRenderer, backRenderer }}>
      <UI.Stack alignItems="center">
        <UI.Stack direction="row" alignItems="start" height="100vh">
          <UI.Grid
            templateColumns="repeat(3, auto)"
            templateRows="repeat(2, auto)"
            gap={2}
            overflowY="scroll"
            maxH="100%"
            p={4}
          >
            <UI.Box>
              <UI.Text>{currentCity.name}'s turn</UI.Text>
              <UI.Text>{phase}</UI.Text>
              {canDiscard ? (
                <UI.Button colorScheme="red" onClick={() => skipDiscard()}>
                  Skip discard
                </UI.Button>
              ) : null}
              {canSkipTurn ? (
                <UI.Button colorScheme="red" onClick={() => skipTurn()}>
                  Skip turn for 1 coin
                </UI.Button>
              ) : null}
            </UI.Box>
            <UI.Stack direction="row" gridArea="1 / 3">
              {residences.items.map((building, i) => {
                return (
                  <Card.CardStack
                    key={i}
                    cards={[building]}
                    showing={Card.CardShowing.Face}
                    onCardClick={canBuy ? buyBuilding : undefined}
                  />
                );
              })}
            </UI.Stack>
            <UI.Stack gridArea="2 / 1">
              {discardedBuildingsByCost.map((buildings, i) => {
                return (
                  <Card.CardStack
                    key={i}
                    cards={buildings}
                    showing={Card.CardShowing.Face}
                  />
                );
              })}
            </UI.Stack>
            <UI.Stack gridArea="2 / 2">
              {buildingsByCost.map((buildings, i) => {
                return (
                  <Card.CardStack
                    key={i}
                    cards={buildings}
                    showing={Card.CardShowing.Back}
                    onCardClick={canDraw ? drawBuilding : undefined}
                  />
                );
              })}
            </UI.Stack>
            <UI.Stack gridArea="2 / 3">
              {buildingsForSaleByCost.map((buildings, i) => {
                return (
                  <Card.CardRow
                    key={i}
                    cards={buildings}
                    showing={Card.CardShowing.Face}
                    hoverStyle={canDiscard ? 'discard' : undefined}
                    onCardClick={
                      canDiscard
                        ? discardBuildingForSale
                        : canBuy
                        ? buyBuilding
                        : undefined
                    }
                  />
                );
              })}
            </UI.Stack>
          </UI.Grid>
          <UI.Stack overflowY="scroll" maxH="100%" p={4}>
            {cities.items.map((city, i) => {
              const isActive = city === currentCity;
              return (
                <UI.Stack key={i}>
                  <UI.Stack
                    direction="row"
                    bg="gray.800"
                    borderRadius="10px"
                    px={4}
                    py={2}
                    fontWeight={isActive ? 'bold' : ''}
                  >
                    <UI.Text>City {i + 1}</UI.Text>
                    <UI.Text>Coins: {city.coins || 0}</UI.Text>
                  </UI.Stack>
                  <Card.CardGrid
                    cards={city.buildings}
                    showing={Card.CardShowing.Face}
                    rows={2}
                    columns={5}
                  />
                </UI.Stack>
              );
            })}
          </UI.Stack>
        </UI.Stack>
      </UI.Stack>
    </Card.CardTheme.Provider>
  );
};

export default HappyCityPage;
