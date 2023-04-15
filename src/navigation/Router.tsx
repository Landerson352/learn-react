import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import _ from 'lodash';

import { routes } from './routes';
import { Layout } from '../Layout';

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {_.map(routes, (routeFn, routeId) => {
            const route = routeFn();
            return (
              <Route
                key={routeId}
                path={route.path}
                element={<route.element />}
              />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
