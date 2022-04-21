import React from 'react';

export const createContextProvider = function <T, K>(
  useValue: (props: K) => T,
  initialValue: T = {} as T
) {
  const Context = React.createContext(initialValue);

  const useContext = () => React.useContext(Context);

  const Provider: React.FC<{ value: K }> = ({ children, value }) => {
    const newValue = useValue(value);
    return <Context.Provider value={newValue}>{children}</Context.Provider>;
  };

  return {
    Context,
    useContext,
    Provider,
  };
};

export default createContextProvider;
