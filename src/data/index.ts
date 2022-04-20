import { useCollection } from 'react-firebase-hooks/firestore';
import {
  addDoc,
  deleteDoc,
  doc,
  collection,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

import { app } from '../firebase';
import { useAuthState } from '../auth';
import { PastedItem, PastedItemDocument } from '../plopper/pastedItem';
import { Tag, TagDocument } from '../plopper/tag';

export const firestore = getFirestore(app);

/**
 * Items
 */
export const useOwnedItemDocs = (): [PastedItemDocument[], boolean, string] => {
  const [user, authStateLoading, authStateError] = useAuthState();

  const [itemsSnapshot, itemsLoading, itemsError] = useCollection(
    query(collection(firestore, 'items'), where('userId', '==', user?.uid)),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const docs: PastedItemDocument[] =
    itemsSnapshot?.docs.map((doc) => {
      const data = doc.data();
      return {
        ...(data as PastedItem),
        id: doc.id,
        created: data.created?.toDate(),
      };
    }) || [];

  const loading = authStateLoading || itemsLoading;
  const errorMessage = authStateError?.message || itemsError?.message || '';

  return [docs, loading, errorMessage];
};

export const addItem = async (item: PastedItem) => {
  const result = await addDoc(collection(firestore, 'items'), item);
  return result.id;
};

export const removeItem = (itemId: string) => {
  return deleteDoc(doc(firestore, 'items', itemId));
};

/**
 * Tags
 */
export const useOwnedTagDocs = (): [TagDocument[], boolean, string] => {
  const [user, authStateLoading, authStateError] = useAuthState();

  const [tagsSnapshot, tagsLoading, tagsError] = useCollection(
    query(collection(firestore, 'tags'), where('userId', '==', user?.uid)),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const docs: TagDocument[] =
    tagsSnapshot?.docs.map((doc) => {
      const data = doc.data();
      return {
        ...(data as Tag),
        id: doc.id,
        created: data.created?.toDate(),
      };
    }) || [];

  const loading = authStateLoading || tagsLoading;
  const errorMessage = authStateError?.message || tagsError?.message || '';

  return [docs, loading, errorMessage];
};

export const addTag = async (tag: Tag) => {
  const result = await addDoc(collection(firestore, 'tags'), tag);
  return result.id;
};

export const removeTag = (tagId: string) => {
  return deleteDoc(doc(firestore, 'tags', tagId));
};
