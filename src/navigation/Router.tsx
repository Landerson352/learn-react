import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import _ from 'lodash';

import { routes } from './routes';
import { Layout } from '../Layout';

import ExamplesPage from '../pages/ExamplesPage';
import CompositionalPatterns from '../pages/patterns/CompositionalPatternsPage';
import JavascriptPatterns from '../pages/patterns/JavascriptPatternsPage';
import LincChallenge1Page from '../pages/challenges/LincChallenge1Page';
import FirebasePage from '../pages/firebase/FirebasePage';
import DragAndDropExample from '../pages/dnd/DragAndDropExample';
import DndKitPage from '../pages/dnd-kit/DndKitPage';
import TabContextDemoPage from '../pages/TabContextDemoPage';
import GlobePage from '../pages/GlobePage';

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            {...routes.challenges_linc_1()}
            element={<LincChallenge1Page />}
          />
          <Route
            {...routes.patterns_composition()}
            element={<CompositionalPatterns />}
          />
          <Route {...routes.patterns_js()} element={<JavascriptPatterns />} />
          <Route {...routes.dnd()} element={<DragAndDropExample />} />
          <Route {...routes.dndKit()} element={<DndKitPage />} />
          <Route {...routes.firebase()} element={<FirebasePage />} />
          <Route {...routes.globe()} element={<GlobePage />} />
          <Route {...routes.tabContext()} element={<TabContextDemoPage />} />
          <Route {...routes.home()} element={<ExamplesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
