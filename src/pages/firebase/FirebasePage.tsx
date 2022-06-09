import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import * as UI from '@chakra-ui/react';

import { signOut, useAuthState, useSignIn } from '../../firebase/auth';
import { addMessage, useMessages } from './data';
import { Container, Input, VStack } from '@chakra-ui/react';
import { formatDistance } from 'date-fns';
import MessageThread from './components/MessageThread';

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

interface MessageItemProps {
  message: any;
  containerRef: HTMLDivElement | null;
}

const MessageItem = ({ message, containerRef }: MessageItemProps) => {
  const [showThread, setShowThread] = useState(false);
  const [itemRef, setItemRef] = useState<HTMLLIElement | null>(null);
  // const itemRef = useRef<HTMLLIElement>(null);
  console.log(itemRef?.offsetTop, 'itemRef');

  return (
    <UI.ListItem
      display={'block'}
      // maxHeight={400}
      key={message.id}
      ref={(el) => {
        setItemRef(el);
      }}
    >
      <UI.Text>
        {message.authorName}: {message.text} at{' '}
        {formatDistance(message.time, new Date(), { addSuffix: true })}
      </UI.Text>
      <UI.Button onClick={() => setShowThread(!showThread)}>Thread</UI.Button>
      {showThread && (
        <MessageThread
          containerRef={containerRef}
          message={message}
          itemRef={itemRef}
        />
      )}
    </UI.ListItem>
  );
};

const MessageList: React.FC = () => {
  const [messages, loading, error] = useMessages({ limit: 100 });
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef && messages && !loading) {
      scrollRef.scrollTo({ top: scrollRef.scrollHeight });
    }
  }, [messages, loading, scrollRef]);

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Text>{error.message}</UI.Text>;

  return (
    <Container
      overflow={'scroll'}
      maxHeight={400}
      // alignSelf={'center'}
      ref={(el) => {
        setScrollRef(el);
      }}
    >
      <UI.UnorderedList>
        {messages &&
          _.reverse(messages)?.map((message) => (
            <MessageItem
              message={message}
              key={message.id}
              containerRef={scrollRef}
            />
          ))}
      </UI.UnorderedList>
    </Container>
  );
};

const FirebasePage: React.FC = () => {
  const [user, loading, error] = useAuthState();

  const messageInputRef = useRef<HTMLInputElement>(null);

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Text>{error.message}</UI.Text>;
  if (!user) return <SignInButton />;

  const handleAddClick = () => {
    console.log(messageInputRef.current?.value);
    if (messageInputRef.current?.value) {
      addMessage({
        text: messageInputRef.current?.value || '',
        authorName: user.displayName ?? 'John Doe',
        uid: user.uid,
        time: Date.now(),
        // thread: { messages: [] },
      });

      messageInputRef.current.value = '';
    }
  };

  return (
    <React.Fragment>
      <Container display={'flex'} flexDir={'column'}>
        <UI.Button colorScheme="green" onClick={() => signOut()}>
          Sign Out
        </UI.Button>
        <UI.Divider />
        <UI.Divider />
        <VStack>
          <MessageList />
          <Container>
            <Input name="messageInput" ref={messageInputRef} />
            <UI.Button colorScheme="green" onClick={handleAddClick}>
              Add message
            </UI.Button>
          </Container>
        </VStack>
      </Container>
    </React.Fragment>
  );
};

export default FirebasePage;
