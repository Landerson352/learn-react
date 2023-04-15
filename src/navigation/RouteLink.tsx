import * as UI from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from './routes';

export type RouteLinkProps = UI.LinkProps & {
  route: AppRoute;
};

export const RouteLink = React.forwardRef<HTMLAnchorElement, RouteLinkProps>(
  ({ route, ...props }, ref) => {
    return (
      <UI.Link ref={ref} as={Link} to={route.path} {...props}>
        {route.title}
      </UI.Link>
    );
  }
);
