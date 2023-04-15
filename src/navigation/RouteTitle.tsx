import * as UI from '@chakra-ui/react';
import React from 'react';
import { AppRoute } from './routes';

export type RouteTitleProps = UI.HeadingProps & {
  route: AppRoute;
};

export const RouteTitle = React.forwardRef<HTMLHeadingElement, RouteTitleProps>(
  ({ route, ...props }, ref) => {
    return (
      <UI.Heading ref={ref} size="2xl" mb={5} {...props}>
        {route.title}
      </UI.Heading>
    );
  }
);
