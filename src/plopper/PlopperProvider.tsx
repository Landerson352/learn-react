import React from 'react';

import { PastedData, usePastedDataCallback } from './pastedData';
import { PastedItems, usePastedItems } from './pastedItem';
import { Tags, useTags } from './tag';

export interface PlopperShape {
  pastedItems: PastedItems;
  tags: Tags;
}

export const PlopperContext = React.createContext<PlopperShape>(
  {} as PlopperShape
);

export const usePlopper = () => React.useContext(PlopperContext);

export const PlopperProvider: React.FC = ({ children }) => {
  const pastedItems = usePastedItems();
  const tags = useTags();
  const { add } = pastedItems;

  // Automatically created a new item when data is pasted
  const handlePaste = React.useCallback(
    (data: PastedData) => {
      add({ data });
    },
    [add]
  );

  usePastedDataCallback(handlePaste);

  return (
    <PlopperContext.Provider value={{ pastedItems, tags }}>
      {children}
    </PlopperContext.Provider>
  );
};

export default PlopperProvider;
