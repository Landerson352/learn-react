import createShortCode from '../helpers/createShortCode';
import { Building } from './types';

export const createMarket = (): Building => {
  return {
    id: createShortCode(),
    name: 'Happy Market',
    cost: 0,
    color: 'white',
    income: 1,
  };
};

export const createBuildings = (): Building[] => {
  return [
    {
      id: createShortCode(),
      name: 'Factory',
      color: 'purple',
      cost: 1,
      income: 1,
      hearts: -1,
    },
    {
      id: createShortCode(),
      name: 'Factory',
      color: 'purple',
      cost: 1,
      income: 1,
      hearts: -1,
    },
    {
      id: createShortCode(),
      name: 'Haunted House',
      color: 'orange',
      cost: 1,
      income: 1,
      citizens: -1,
    },
    {
      id: createShortCode(),
      name: 'Haunted House',
      color: 'orange',
      cost: 1,
      income: 1,
      citizens: -1,
    },
    {
      id: createShortCode(),
      name: 'Police Station',
      color: 'blue',
      cost: 2,
      citizens: 2,
    },
  ];
};

export const createResidences = (): Building[] => {
  return [
    {
      id: createShortCode(),
      name: 'House',
      color: 'green',
      cost: 1,
      citizens: 1,
    },
    {
      id: createShortCode(),
      name: 'Apartment Building',
      color: 'green',
      cost: 3,
      citizens: 2,
    },
    {
      id: createShortCode(),
      name: 'High Rise',
      color: 'green',
      cost: 6,
      citizens: 3,
    },
  ];
};
