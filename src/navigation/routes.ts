import ExamplesPage from '../pages/ExamplesPage';
import CompositionalPatterns from '../pages/patterns/CompositionalPatternsPage';
import JavascriptPatterns from '../pages/patterns/JavascriptPatternsPage';
import LincChallenge1Page from '../pages/challenges/LincChallenge1Page';
import FirebasePage from '../pages/firebase/FirebasePage';
import DragAndDropExample from '../pages/dnd/DragAndDropExample';
import DndKitPage from '../pages/dnd-kit/DndKitPage';
import TabContextDemoPage from '../pages/TabContextDemoPage';

// This is a simple way to define routes.
// It can be used to built out the router, and to wire up links.
export const routes = {
  challenges_linc_1: () => ({
    path: '/challenges/linc/1',
    element: LincChallenge1Page,
    title: "Linc's Challenge #1",
  }),
  patterns_composition: () => ({
    path: '/patterns/composition',
    element: CompositionalPatterns,
    title: 'Compositional Patterns',
  }),
  patterns_js: () => ({
    path: '/patterns/js',
    element: JavascriptPatterns,
    title: 'Javascript Patterns',
  }),
  dnd: () => ({
    path: '/dnd',
    element: DragAndDropExample,
    title: 'Drag and Drop',
  }),
  dndKit: () => ({
    path: '/dnd-kit',
    element: DndKitPage,
    title: 'DnD-Kit',
  }),
  firebase: () => ({
    path: '/firebase',
    element: FirebasePage,
    title: 'Firebase',
  }),
  tabContext: () => ({
    path: '/tab-context',
    element: TabContextDemoPage,
    title: 'Tab Context',
  }),
  home: (segment = ':segment?') => ({
    path: `/${segment}`,
    element: ExamplesPage,
    title: 'Examples',
  }),
};

export type AppRoute = ReturnType<typeof routes[keyof typeof routes]>;

export const mainMenuMenuItems = {
  Examples: [
    routes.home(''),
    routes.tabContext(),
    routes.dnd(),
    routes.dndKit(),
    routes.firebase(),
  ],
  Patterns: [routes.patterns_composition(), routes.patterns_js()],
  Challenges: [routes.challenges_linc_1()],
};
