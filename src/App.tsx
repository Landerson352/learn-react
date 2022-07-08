import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import ExamplesPage from './pages/ExamplesPage';
import CompositionalPatterns from './pages/patterns/CompositionalPatternsPage';
import JavascriptPatterns from './pages/patterns/JavascriptPatternsPage';
import LincChallenge1Page from './pages/challenges/LincChallenge1Page';
import FirebasePage from './pages/firebase/FirebasePage';
import DragAndDropExample from './pages/dnd/DragAndDropExample';
import DndKitPage from './pages/dnd-kit/DndKitPage';
import TabContextDemoPage from './pages/TabContextDemoPage';
import { TileGamePage } from './pages/tileGame/TileGamePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Switch>
          <Route path="/challanges/linc/1">
            <LincChallenge1Page />
          </Route>
          <Route path="/patterns/composition">
            <CompositionalPatterns />
          </Route>
          <Route path="/patterns/js">
            <JavascriptPatterns />
          </Route>
          <Route path="/dnd">
            <DragAndDropExample />
          </Route>
          <Route path="/dnd-kit">
            <DndKitPage />
          </Route>
          <Route path="/firebase">
            <FirebasePage />
          </Route>
          <Route path="/layout">
            <TileGamePage />
          </Route>
          <Route path="/tab-context">
            <TabContextDemoPage />
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
