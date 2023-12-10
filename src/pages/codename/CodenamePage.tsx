import React from 'react';
import * as UI from '@chakra-ui/react';
import { RouteTitle } from '../../navigation/RouteTitle';
import { routes } from '../../navigation/routes';
import _ from 'lodash';

const formatMoney = (value: number = 0) => {
  return `$${value}`;
};

type ItemClass = 'goods' | 'equipment' | 'crew';
type ItemType = 'narcotic' | 'tech' | 'organic' | 'mineral' | 'media';

type Item = {
  name: string;
  class: ItemClass;
  type?: ItemType;
  value?: number;
};

type Ship = {
  cash: number;
  items: Item[];
  maxItems: number;
};

const initialShip: Ship = {
  cash: 1000,
  items: [
    {
      name: 'Diesel Engine',
      class: 'equipment',
      value: 100,
    },
  ],
  maxItems: 10,
};

const itemLibrary: Item[] = [
  {
    name: 'Diesel Engine',
    class: 'equipment',
    value: 100,
  },
];

const useGameState = () => {
  const [ship, setShip] = React.useState<Ship>(initialShip);
  const [shop, setShop] = React.useState<Item[]>([]);

  const buy = (item: Item) => {
    const value = item.value || 0;
    if (ship.cash >= value) {
      setShip({
        ...ship,
        cash: ship.cash - value,
        items: [...ship.items, item],
      });
      setShop(_.without(shop, item));
    }
  };

  const sell = (item: Item) => {
    const value = item.value || 0;
    setShip({
      ...ship,
      cash: ship.cash + value,
      items: _.without(ship.items, item),
    });
    setShop([...shop, item]);
  };

  const canBuy = (item: Item) => {
    if (!shop.includes(item)) return false;
    if (ship.items.length >= ship.maxItems) return false;
    if (item.value && ship.cash < item.value) return false;
    return true;
  };

  const canSell = (item: Item) => {
    return ship.items.includes(item);
  };

  const generateShop = () => {
    const shopSize = _.random(1, 5);
    // const items = _.cloneDeep(_.sampleSize(itemLibrary, shopSize));

    const items = _.times(shopSize, () => {
      return _.cloneDeep(_.sample(itemLibrary)) as Item;
    });
    setShop(items);
  };

  const endTurn = () => {
    generateShop();
  };

  return {
    ship,
    shop,
    buy,
    sell,
    canBuy,
    canSell,
    endTurn,
  };
};

const ItemGrid: React.FC<
  Omit<UI.SimpleGridProps, 'children'> & {
    items: Item[];
    children?: React.FC<{ item: Item }>;
    emptyText?: string;
  }
> = ({ items, children, emptyText, ...restProps }) => {
  if (items.length === 0)
    return (
      <UI.Box bg="gray.50" borderRadius="md" p={4} mb={4}>
        <UI.Text>{emptyText || 'No items'}</UI.Text>
      </UI.Box>
    );

  return (
    <UI.SimpleGrid columns={2} spacing={2} mb={4} {...restProps}>
      {items.map((item, i) => (
        <UI.Card key={i}>
          <UI.CardBody py={4}>
            <UI.Heading size="sm">{item.name}</UI.Heading>
            <UI.Badge>{item.class}</UI.Badge>
          </UI.CardBody>
          <UI.CardFooter py={4}>{children?.({ item })}</UI.CardFooter>
        </UI.Card>
      ))}
    </UI.SimpleGrid>
  );
};

const CodenamePage: React.FC = () => {
  const { ship, shop, buy, sell, canBuy, canSell, endTurn } = useGameState();

  return (
    <UI.Box p={4}>
      <UI.Box mb={4}>
        <UI.Heading mb={2}>Ship</UI.Heading>
        <UI.HStack>
          <UI.Button size="lg" colorScheme="green" onClick={endTurn}>
            Next Stop
          </UI.Button>
          <UI.Box>
            <UI.Text>Cash: {formatMoney(ship.cash)}</UI.Text>
            <UI.Text>
              Capacity: {ship.items.length}/{ship.maxItems}
            </UI.Text>
          </UI.Box>
        </UI.HStack>
      </UI.Box>
      <ItemGrid items={ship.items} mb={4}>
        {({ item }) => (
          <UI.Button
            size="xs"
            colorScheme="yellow"
            onClick={() => sell(item)}
            isDisabled={!canSell(item)}
          >
            Sell for {formatMoney(item.value)}
          </UI.Button>
        )}
      </ItemGrid>
      <UI.Box mb={4}>
        <UI.Heading>Shop</UI.Heading>
      </UI.Box>
      <ItemGrid items={shop} mb={4}>
        {({ item }) => (
          <UI.Button
            size="xs"
            colorScheme="yellow"
            onClick={() => buy(item)}
            isDisabled={!canBuy(item)}
          >
            Buy for {formatMoney(item.value)}
          </UI.Button>
        )}
      </ItemGrid>
    </UI.Box>
  );
};

export default CodenamePage;
