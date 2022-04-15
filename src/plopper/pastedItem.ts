import { PastedData } from './pastedData';
import { useAuthState } from '../auth';
import { useOwnedItemDocs, addItem, removeItem } from '../data';

export interface PastedItemInput {
  data: PastedData;
}

export interface PastedItem extends PastedItemInput {
  userId: string;
  created: Date;
}

export interface PastedItemDocument extends PastedItem {
  id: string;
}

export interface PastedItems {
  itemDocs: PastedItemDocument[];
  add: (item: PastedItemInput) => Promise<string | undefined>;
  remove: (itemId: string) => Promise<void> | undefined;
  loading: boolean;
  errorMessage: string;
}

export const usePastedItems = (): PastedItems => {
  const [user] = useAuthState();
  const [itemDocs, loading, errorMessage] = useOwnedItemDocs();

  const add = async (item: PastedItemInput) => {
    if (!user) return;

    return addItem({
      ...item,
      userId: user?.uid,
      created: new Date(),
    });
  };

  const remove = (itemId: string) => {
    return removeItem(itemId);
  };

  const itemDocsSortedByCreated = itemDocs.sort(
    (a, b) => b.created?.getTime() || 0 - a.created?.getTime() || 0
  );

  return {
    itemDocs: itemDocsSortedByCreated,
    add,
    remove,
    loading,
    errorMessage,
  };
};
