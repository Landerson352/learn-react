import { addDoc, collection, limit, orderBy, query } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { createConverter, firestore } from '../../firebase/firestore';
import { Message } from './types';

const messageConverter = createConverter<Message>();

export const useMessages = (options?: { limit: number }) => {
  const ref = collection(firestore, 'messages').withConverter(messageConverter);
  return useCollectionData(
    query(ref, orderBy('time', 'desc'), limit(options?.limit || 1000))
  );
};

export const addMessage = (data: Message) => {
  return addDoc(
    collection(firestore, 'messages').withConverter(messageConverter),
    data
  );
};
