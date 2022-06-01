import React from 'react';
import * as UI from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { formatRelative } from 'date-fns';
import _ from 'lodash';
import fontColorContrast from 'font-color-contrast';
import * as FramerMotion from 'framer-motion';

import { signOut, useAuthState, useSignIn } from '../../firebase/auth';
import { addMessage, useMessages } from './data';
import { Message } from './types';

const MotionUI = {
  Box: FramerMotion.motion(UI.Box),
};

export const SignInButton: React.FC = () => {
  const [signIn, , loading] = useSignIn();

  return (
    <UI.Button
      size="sm"
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

const MessageView: React.FC<{ message: Message } & UI.BoxProps> = ({
  message,
  ...boxProps
}) => {
  const backgroundColor = getFirstMentionedColorFromMessage(message) || 'white';
  const color = backgroundColor ? fontColorContrast(backgroundColor) : '';

  const words = message.text.toLowerCase().split(' ');
  const isSpinning =
    _.intersection(words, [
      'spin',
      'spinning',
      'rotate',
      'rotating',
      'whirl',
      'dizzy',
    ]).length > 0;
  const isFun =
    _.intersection(words, ['fun', 'comic', 'haha', 'ha', 'lol']).length > 0;

  return (
    <UI.Box px={1} py="1px" {...boxProps}>
      <MotionUI.Box
        px={3}
        py={2}
        borderRadius="md"
        backgroundColor={backgroundColor}
        color={color}
        animate={isSpinning ? { rotate: 360 } : ''}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        boxShadow={isSpinning ? 'md' : ''}
        zIndex={isSpinning ? 1 : 0}
        position="relative"
        fontFamily={isFun ? 'Comic Sans MS' : ''}
      >
        <UI.Stack direction="row">
          <UI.Avatar
            name={message.authorName}
            size="sm"
            src={message.avatar || ''}
          />
          <UI.Box>
            <UI.Stack direction="row" spacing={1}>
              <UI.Text fontWeight="bold">{message.authorName}</UI.Text>
              <UI.Text fontSize="sm" opacity={0.4}>
                {formatRelative(message.time, new Date())}
              </UI.Text>
              <UI.Tooltip label={JSON.stringify(message)} placement="top">
                <UI.Text
                  fontSize="sm"
                  fontWeight="bold"
                  opacity={0.4}
                  cursor="pointer"
                >
                  [json]
                </UI.Text>
              </UI.Tooltip>
            </UI.Stack>
            <UI.Text>{message.text}</UI.Text>
          </UI.Box>
        </UI.Stack>
      </MotionUI.Box>
    </UI.Box>
  );
};

const getFirstMentionedColorFromMessage = (message: Message) => {
  const words = message.text.toLowerCase().split(' ');
  return _.find(words, (word) => CSS.supports('color', word)) || '';
};

const getFirstMentionedColorFromMessages = (
  messages: Message[] | undefined
) => {
  let firstColor = '';
  _.find(messages, (message) => {
    const color = getFirstMentionedColorFromMessage(message);
    if (color) firstColor = color;
    return color;
  });
  return firstColor;
};

const MessageList: React.FC<UI.StackProps> = (stackProps) => {
  const [messages, loading, error] = useMessages({ limit: 100 });

  if (loading) {
    return (
      <UI.Stack {...stackProps}>
        <UI.Spinner />
      </UI.Stack>
    );
  }

  if (error) {
    return (
      <UI.Stack {...stackProps}>
        <UI.Text>{error.message}</UI.Text>
      </UI.Stack>
    );
  }

  return (
    <UI.Stack lineHeight={5} spacing={0} {...stackProps} alignItems="start">
      {messages?.map((message, i) => (
        <MessageView key={message.id} message={message} />
      ))}
    </UI.Stack>
  );
};

interface NewMessageFormData {
  text: string;
}

const NewMessageForm: React.FC<UI.StackProps> = (stackProps) => {
  const [user] = useAuthState();
  const { formState, ...form } = useForm<NewMessageFormData>({
    mode: 'onTouched',
  });

  if (!user) return null;

  const onValid = (data: NewMessageFormData) => {
    addMessage({
      text: data.text,
      authorName: user.displayName || 'Anonymous',
      avatar: user.photoURL || '',
      uid: user.uid,
      time: Date.now(),
    });
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onValid)}>
      <UI.Stack direction="row" {...stackProps}>
        <UI.FormControl>
          <UI.Input
            bg="white"
            {...form.register('text', { required: true })}
            autoFocus
            autoComplete="off"
          />
        </UI.FormControl>
        <UI.Button
          type="submit"
          colorScheme="green"
          disabled={!formState.isValid}
        >
          Send
        </UI.Button>
      </UI.Stack>
    </form>
  );
};

const Header: React.FC<UI.StackProps> = (stackProps) => {
  const [user] = useAuthState();

  return (
    <UI.Stack
      justifyContent="space-between"
      direction="row"
      alignItems="center"
      {...stackProps}
    >
      <UI.Box fontWeight="bold" fontSize="xl">
        FireChat
      </UI.Box>
      {user ? (
        <UI.Button
          size="sm"
          variant="outline"
          colorScheme="black"
          onClick={signOut}
        >
          Sign Out
        </UI.Button>
      ) : (
        <SignInButton />
      )}
    </UI.Stack>
  );
};

const FirebasePage: React.FC = () => {
  const [user, loading, error] = useAuthState();

  if (loading) return <UI.Spinner />;
  if (error) return <UI.Alert colorScheme="red">{error.message}</UI.Alert>;

  return (
    <UI.Flex h="100vh" direction="column" bg="white">
      <Header flex="0 0 auto" p={3} bg="gray.200" />
      {user ? (
        <React.Fragment>
          <MessageList
            direction="column-reverse"
            flex="1 1 0"
            overflow="scroll"
          />
          <NewMessageForm flex="0 0 auto" p={3} bg="gray.200" />
        </React.Fragment>
      ) : null}
    </UI.Flex>
  );
};

export default FirebasePage;
