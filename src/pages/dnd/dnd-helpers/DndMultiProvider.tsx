import React from 'react';
import { DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';

export const DndMultiProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return <DndProvider options={HTML5toTouch} {...props} />;
};

export default DndMultiProvider;
