import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import React from 'react';
import { DndProvider } from 'react-dnd-multi-backend';

export const DndMultiProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return <DndProvider options={HTML5toTouch} {...props} />;
};

export default DndMultiProvider;
