import React from 'react';
import * as UI from '@chakra-ui/react';

import { signOut, useAuthState, useSignIn } from '.';

export const SignOutButton: React.FC<UI.ButtonProps> = (props) => {
  return <UI.Button onClick={() => signOut()} children="Sign Out" {...props} />;
};

export const SignInButton: React.FC<UI.ButtonProps> = (props) => {
  const [signIn, , loading] = useSignIn();

  return (
    <UI.Button
      onClick={() => {
        signIn();
      }}
      disabled={loading}
      loading={loading}
      children="Sign In with Google"
      {...props}
    />
  );
};

const AuthButton: React.FC = () => {
  const [user, loading, error] = useAuthState();

  if (loading || error) return null;

  return user ? <SignOutButton /> : <SignInButton />;
};

export default AuthButton;
