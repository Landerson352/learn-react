// This is a simple way to define routes.
// It can be used to built out the router, and to wire up links.
export const routes = {
  challenges_linc_1: () => ({
    path: '/challenges/linc/1',
    title: "Linc's Challenge #1",
  }),
  patterns_composition: () => ({
    path: '/patterns/composition',
    title: 'Compositional Patterns',
  }),
  patterns_js: () => ({
    path: '/patterns/js',
    title: 'Javascript Patterns',
  }),
  dnd: () => ({
    path: '/dnd',
    title: 'Drag and Drop',
  }),
  dndKit: () => ({
    path: '/dnd-kit',
    title: 'DnD-Kit',
  }),
  firebase: () => ({
    path: '/firebase',
    title: 'Firebase',
  }),
  tabContext: () => ({
    path: '/tab-context',
    title: 'Tab Context',
  }),
  home: (segment = ':segment?') => ({
    path: `/${segment}`,
    title: 'Examples',
  }),
};

export type AppRoute = ReturnType<typeof routes[keyof typeof routes]>;

export const mainMenuMenuItems = {
  Demos: [
    routes.home(''),
    routes.tabContext(),
    routes.dnd(),
    routes.dndKit(),
    routes.firebase(),
  ],
  Patterns: [routes.patterns_composition(), routes.patterns_js()],
  Challenges: [routes.challenges_linc_1()],
};
