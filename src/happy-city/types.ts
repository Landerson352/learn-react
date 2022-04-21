import { Card } from '../cards';

export type Color =
  | 'orange'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'white'
  | 'black';

export interface Building extends Card {
  name: string;
  color: Color;
  cost: number;
  requirements?: { color: Color; amount: number }[];
  income?: number;
  hearts?: number;
  citizens?: number;
}

export interface City {
  id: string;
  name: string;
  coins: number;
  buildings: Building[];
}
