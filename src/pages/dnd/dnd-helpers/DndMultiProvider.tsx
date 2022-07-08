import React from 'react';
import { Backends, DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

export const DndMultiProvider: React.FC<{
  context?: any;
  debugMode?: boolean | undefined;
  options?: Backends;
}> = (props) => {
  return <DndProvider options={HTML5toTouch} {...props} />;
};

export default DndMultiProvider;
