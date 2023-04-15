import * as UI from '@chakra-ui/react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Outlet } from 'react-router-dom';
import _ from 'lodash';

import { mainMenuMenuItems } from './navigation/routes';
import { RouteLink } from './navigation/RouteLink';

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <Outlet />
      <UI.Menu>
        <UI.MenuButton
          as={UI.IconButton}
          icon={<FontAwesomeIcon icon={faBars} />}
          position="fixed"
          top={4}
          right={4}
          aria-label="menu"
          size="lg"
          variant="outline"
          colorScheme="green"
          borderRadius="full"
        />
        <UI.MenuList>
          {_.map(mainMenuMenuItems, (routes, groupTitle) => (
            <UI.MenuGroup key={groupTitle} title={groupTitle}>
              {_.map(routes, (route, routeId) => (
                <UI.MenuItem
                  key={routeId}
                  as={RouteLink}
                  route={route}
                  fontSize="sm"
                  pl={8}
                  _hover={{ textDecoration: 'none' }}
                />
              ))}
            </UI.MenuGroup>
          ))}
        </UI.MenuList>
      </UI.Menu>
    </React.Fragment>
  );
};
