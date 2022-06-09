import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import ExamplesPage from './pages/ExamplesPage';
import CompositionalPatterns from './pages/patterns/CompositionalPatternsPage';
import JavascriptPatterns from './pages/patterns/JavascriptPatternsPage';
import LincChallange1Page from './pages/challenges/LincChallenge1Page';
import FirebasePage from './pages/firebase/FirebasePage';
import { useColorMode } from '@chakra-ui/react';

const App: React.FC = () => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);

  return (
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Switch>
          <Route path="/challanges/linc/1">
            <LincChallange1Page />
          </Route>
          <Route path="/patterns/composition">
            <CompositionalPatterns />
          </Route>
          <Route path="/patterns/js">
            <JavascriptPatterns />
          </Route>
          <Route path="/firebase">
            <FirebasePage />
          </Route>
          <Route path="/:segment">
            <ExamplesPage />
          </Route>
          <Route path="/">
            <ExamplesPage />
          </Route>
        </Switch>
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default App;
