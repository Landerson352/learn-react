import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { createModalPath } from './pages/modals/routeModal';
import ExamplesPage from './pages/ExamplesPage';
import CompositionalPatterns from './pages/patterns/CompositionalPatternsPage';
import JavascriptPatterns from './pages/patterns/JavascriptPatternsPage';
import LincChallenge1Page from './pages/challenges/LincChallenge1Page';
import FirebasePage from './pages/firebase/FirebasePage';
import DragAndDropExample from './pages/dnd/DragAndDropExample';
import DndKitPage from './pages/dnd-kit/DndKitPage';
import TabContextDemoPage from './pages/TabContextDemoPage';
import ModalExamplesPage from './pages/modals/ModalExamplesPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/challenges/linc/1" element={<LincChallenge1Page />} />
        <Route
          path="/patterns/composition"
          element={<CompositionalPatterns />}
        />
        <Route path="/patterns/js" element={<JavascriptPatterns />} />
        <Route path="/dnd" element={<DragAndDropExample />} />
        <Route path="/dnd-kit" element={<DndKitPage />} />
        <Route
          path={createModalPath('/modals')}
          element={<ModalExamplesPage />}
        />
        <Route path="/modals" element={<ModalExamplesPage />} />
        <Route path="/firebase" element={<FirebasePage />} />
        <Route path="/tab-context" element={<TabContextDemoPage />} />
        <Route path="/:segment" element={<ExamplesPage />} />
        <Route path="/" element={<ExamplesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
