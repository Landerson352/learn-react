import { getAuth, signOut as fb_signOut } from 'firebase/auth';
import {
  useAuthState as fb_useAuthState,
  useSignInWithGoogle,
} from 'react-firebase-hooks/auth';

import { app } from './app';

export const auth = getAuth(app);
export const signOut = () => fb_signOut(auth);
export const useAuthState = () => fb_useAuthState(auth);
export const useSignIn = () => useSignInWithGoogle(auth);
