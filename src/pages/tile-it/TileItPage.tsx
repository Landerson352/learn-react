import React from 'react';
import * as UI from '@chakra-ui/react';
import { RouteTitle } from '../../navigation/RouteTitle';
import { routes } from '../../navigation/routes';
import { TileIt } from './TileIt';

const TileItPage: React.FC = () => {
  return (
    <UI.Box p={4}>
      <RouteTitle route={routes.tileIt()} />
      <TileIt />
    </UI.Box>
  );
};

export default TileItPage;
