import React from 'react';
import * as UI from '@chakra-ui/react';

import { signOut, useAuthState, useSignIn } from '../../firebase/auth';
import { addMessage, useMessages } from './data';

export const SignInButton: React.FC = () => {
  const [signIn, , loading] = useSignIn();

  return (
    <UI.Button
      colorScheme="green"
      onClick={() => {
        signIn();
      }}
      disabled={loading}
    >
      Sign In with Google
    </UI.Button>
  );
};

const MessageList: React.FC = () => {
  const [messages, loading, error] = useMessages({ limit: 100 });

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Text>{error.message}</UI.Text>;

  return (
    <React.Fragment>
      <UI.UnorderedList>
        {messages?.map((message) => (
          <UI.ListItem key={message.id}>
            <UI.Text>
              {message.authorName}: {message.text} at {message.time}
            </UI.Text>
          </UI.ListItem>
        ))}
      </UI.UnorderedList>
    </React.Fragment>
  );
};

const FirebasePage: React.FC = () => {
  const [user, loading, error] = useAuthState();

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Text>{error.message}</UI.Text>;
  if (!user) return <SignInButton />;

  const handleAddClick = () => {
    addMessage({
      text: 'Hello World',
      authorName: 'John Doe',
      uid: user.uid,
      time: Date.now(),
    });
  };

  return (
    <React.Fragment>
      <UI.Button colorScheme="green" onClick={() => signOut()}>
        Sign Out
      </UI.Button>
      <UI.Divider />
      <UI.Button colorScheme="green" onClick={handleAddClick}>
        Add test message
      </UI.Button>
      <UI.Divider />
      <MessageList />
    </React.Fragment>
  );
};

export default FirebasePage;
