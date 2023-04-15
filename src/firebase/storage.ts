import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../firebase';

export const storage = getStorage(app);

export const uploadImageBlob = async (blob: Blob) => {
  const blobRef = ref(storage, `/images/${uuidV4()}`);
  const snapshot = await uploadBytes(blobRef, blob);
  return getDownloadURL(snapshot.ref);
};
