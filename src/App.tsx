import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LincChallenge1Page from './pages/challenges/LincChallenge1Page';
import SchemaDataGridExamplesPage from './pages/data-grid/SchemaDataGridExamplesPage';
import DndKitPage from './pages/dnd-kit/DndKitPage';
import DragAndDropExample from './pages/dnd/DragAndDropExample';
import ExamplesPage from './pages/ExamplesPage';
import FirebasePage from './pages/firebase/FirebasePage';
import FormExamplesPage from './pages/forms/FormExamplesPage';
import SchemaFormExamplesPage from './pages/forms/SchemaFormExamplesPage';
import ModalExamplesPage from './pages/modals/ModalExamplesPage';
import CompositionalPatterns from './pages/patterns/CompositionalPatternsPage';
import JavascriptPatterns from './pages/patterns/JavascriptPatternsPage';
import TabContextDemoPage from './pages/TabContextDemoPage';
import ViewExamplesPage from './pages/views/ViewExamplesPage';

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
        <Route path="/forms" element={<FormExamplesPage />} />
        {/* Support route modals by appending the "/*" catch-all to the path. */}
        <Route path="/modals/*" element={<ModalExamplesPage />} />
        <Route path="/firebase" element={<FirebasePage />} />
        <Route
          path="/schema-data-grids"
          element={<SchemaDataGridExamplesPage />}
        />
        <Route path="/schema-forms" element={<SchemaFormExamplesPage />} />
        <Route path="/tab-context" element={<TabContextDemoPage />} />
        <Route path="/views" element={<ViewExamplesPage />} />
        <Route path="/:segment" element={<ExamplesPage />} />
        <Route path="/" element={<ExamplesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
