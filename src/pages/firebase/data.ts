import {
  addDoc,
  collection,
  doc,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
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

export const useThread = (
  message: { id: string | undefined },
  options?: { limit: number }
) => {
  // get messages collection reference
  const messagesRef = collection(firestore, 'messages');
  // get document reference
  const docRef = doc(messagesRef, message.id);
  // get messages thread reference
  const threadRef = collection(docRef, 'thread');
  // get the thread
  return useCollectionData(
    query(threadRef, orderBy('time', 'desc'), limit(options?.limit || 1000))
  );
};

export const addThreadMessage = (message: any, data: Message) => {
  return addDoc(
    collection(firestore, 'messages', message.id, 'thread').withConverter(
      messageConverter
    ),
    data
  );
};
