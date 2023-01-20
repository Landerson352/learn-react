import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LincChallenge1Page from './pages/challenges/LincChallenge1Page';
import ColorRampPage from './pages/ColorRampPage';
import DndKitPage from './pages/dnd-kit/DndKitPage';
import DragAndDropExample from './pages/dnd/DragAndDropExample';
import ExamplesPage from './pages/ExamplesPage';
import FirebasePage from './pages/firebase/FirebasePage';
import CompositionalPatterns from './pages/patterns/CompositionalPatternsPage';
import JavascriptPatterns from './pages/patterns/JavascriptPatternsPage';
import TabContextDemoPage from './pages/TabContextDemoPage';

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
        <Route path="/color-ramp" element={<ColorRampPage />} />
        <Route path="/dnd" element={<DragAndDropExample />} />
        <Route path="/dnd-kit" element={<DndKitPage />} />
        <Route path="/firebase" element={<FirebasePage />} />
        <Route path="/tab-context" element={<TabContextDemoPage />} />
        <Route path="/:segment" element={<ExamplesPage />} />
        <Route path="/" element={<ExamplesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
