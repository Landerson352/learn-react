import { Container, Input } from '@chakra-ui/react';
import * as UI from '@chakra-ui/react';
import { formatDistance } from 'date-fns';
import _ from 'lodash';
import { useState, useRef, useEffect } from 'react';
import { useAuthState } from '../../../firebase/auth';
import { useThread, addThreadMessage } from '../data';
import { SignInButton } from '../FirebasePage';

interface MessageThreadProps {
  message: any;
  itemRef: HTMLLIElement | null;
  // scrollHeight: number;
  containerRef: HTMLDivElement | null;
}

const MessageThread = ({
  message,
  containerRef,
  itemRef,
}: MessageThreadProps) => {
  const [messages, loading, error] = useThread(message, { limit: 100 });
  const [user, userLoading, userError] = useAuthState();
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef && itemRef && messages && !loading) {
      containerRef?.scrollTo({ top: itemRef.offsetTop });
      // itemRef.scrollTo({ top: itemRef.scrollHeight });
      // console.log(scrollRef.scrollHeight, "scrollRef.scrollHeight");
      // scrollRef.scrollTo({ top: scrollRef.scrollHeight });
    }
  }, [messages, loading, scrollRef]);

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Text>{error.message}</UI.Text>;
  if (!user) return <SignInButton />;

  const handleAddClick = () => {
    if (messageInputRef.current?.value) {
      addThreadMessage(message, {
        text: messageInputRef.current?.value || '',
        authorName: user.displayName ?? 'John Doe',
        uid: user.uid,
        time: Date.now(),
      });

      messageInputRef.current.value = '';
    }
  };
  return (
    <Container
      // maxHeight={400}
      ref={(el) => {
        setScrollRef(el);
      }}
    >
      <UI.List>
        {messages &&
          _.reverse(messages)?.map((message) => (
            <UI.ListItem key={message.id || message.time}>
              <UI.Text>
                {message.authorName}: {message.text} at{' '}
                {formatDistance(message.time, new Date(), { addSuffix: true })}
              </UI.Text>
            </UI.ListItem>
          ))}
      </UI.List>
      <Input name="messageInput" ref={messageInputRef} />
      <UI.Button colorScheme="green" onClick={handleAddClick}>
        Add message
      </UI.Button>
    </Container>
  );
};

export default MessageThread;
