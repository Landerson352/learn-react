import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

// type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// type RequiredBy<T, K extends keyof T> = Partial<Omit<T, K>> &
//   Required<Pick<T, K>>;

export const createCollectionSetterMethods = <T, K extends keyof T>(
  idField: K,
  items: T[],
  setItems: (v: T[]) => void
) => {
  const push = (item: T) => {
    setItems([...items, { ...item }]);
  };
  const unshift = (item: T) => {
    setItems([item, ...items]);
  };
  const overwrite = (item: T) => {
    setItems(items.map((d) => (d[idField] === item[idField] ? item : d)));
  };
  const patch = (item: Partial<T>) => {
    setItems(
      items.map((d) => (d[idField] === item[idField] ? { ...d, ...item } : d))
    );
  };
  const remove = (itemToRemove: T) => {
    setItems(items.filter((item) => item[idField] !== itemToRemove[idField]));
  };
  const removeById = (id: T[K]) => {
    setItems(items.filter((item) => item[idField] !== id));
  };
  return {
    items,
    push,
    unshift,
    overwrite,
    patch,
    remove,
    removeById,
    count: items.length,
  };
};

export const useCollection = <T, K extends keyof T>(
  initialValue: T[] = [],
  idField: K
) => {
  const [items, setItems] = React.useState(initialValue);
  return createCollectionSetterMethods(idField, items, setItems);
};

export const useLocalStorageCollection = <T, K extends keyof T>(
  key: string,
  initialValue: T[] = [],
  idField: K
) => {
  const [items, setItems] = useLocalStorageState(key, initialValue);
  return createCollectionSetterMethods(idField, items, setItems);
};

export default useCollection;
