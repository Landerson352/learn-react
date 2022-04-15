import React from 'react';
import * as UI from '@chakra-ui/react';
import SanitizedHTML from 'react-sanitized-html';
import sanitizeHTML from 'sanitize-html';
import ReactPlayer from 'react-player';

import { PastedItem } from './pastedItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import useInnerElementBackgroundColor from '../helpers/useInnerElementBackgroundColor';

interface PastedItemProps {
  item: PastedItem;
  width: number;
}

export const PastedItemWrapper = React.forwardRef<HTMLDivElement, UI.BoxProps>(
  (props, ref) => {
    return (
      <UI.Box
        ref={ref}
        bg="gray.600"
        color="white"
        borderRadius="lg"
        overflow="hidden"
        shadow="lg"
        p={4}
        {...props}
      />
    );
  }
);

export const HTMLTextItem: React.FC<PastedItemProps> = ({
  item,
  ...wrapperProps
}) => {
  const { ref, backgroundColor } = useInnerElementBackgroundColor(':scope>*>*');

  if (item.data.type !== 'text') return null;

  return (
    <PastedItemWrapper ref={ref} bg={backgroundColor} {...wrapperProps}>
      <SanitizedHTML
        allowedAttributes={{
          ...sanitizeHTML.defaults.allowedAttributes,
          '*': ['style'],
        }}
        html={item.data.text.html}
      />
    </PastedItemWrapper>
  );
};

export const PlainTextItem: React.FC<PastedItemProps> = ({
  item,
  ...wrapperProps
}) => {
  if (item.data.type !== 'text') return null;

  return (
    <PastedItemWrapper {...wrapperProps}>
      {item.data.text.plain.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </PastedItemWrapper>
  );
};

export const ImageItem: React.FC<PastedItemProps> = ({
  item,
  ...wrapperProps
}) => {
  if (item.data.type !== 'image') return null;

  return (
    <PastedItemWrapper p={0} {...wrapperProps}>
      <UI.Image src={item.data.src} alt="..." w="100%" />
    </PastedItemWrapper>
  );
};

export const URLItem: React.FC<PastedItemProps> = ({
  item,
  ...wrapperProps
}) => {
  if (item.data.type !== 'url') return null;

  const url = new URL(item.data.url);
  const meta = item.data.meta;

  return (
    <PastedItemWrapper p={0} {...wrapperProps}>
      <UI.Box
        as="a"
        d="block"
        href={url.toString()}
        target="_blank"
        _hover={{ bg: 'purple.500', '*': { color: 'white' } }}
      >
        {meta.image ? (
          <UI.Image src={meta.image} alt={meta.description} />
        ) : null}
        <UI.Box p={4}>
          <UI.Text fontWeight="bold" mb={2}>
            {meta.title}
          </UI.Text>
          <UI.Text color="gray.400" fontSize="sm">
            {url.hostname} <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </UI.Text>
        </UI.Box>
      </UI.Box>
    </PastedItemWrapper>
  );
};

export const PlayerItem: React.FC<PastedItemProps> = ({
  item,
  ...wrapperProps
}) => {
  if (item.data.type !== 'player') return null;

  const playerAspectRatio = 16 / 9;
  const width = wrapperProps.width;
  const height = Math.floor(width / playerAspectRatio);

  return (
    <PastedItemWrapper p={0} {...wrapperProps}>
      <ReactPlayer url={item.data.url} width={width} height={height} />
    </PastedItemWrapper>
  );
};

export const PastedItemView: React.FC<
  PastedItemProps & {
    onRemoveClick: () => any;
  }
> = ({ item, onRemoveClick, ...restProps }) => {
  const itemProps = { item, ...restProps };

  return (
    <UI.Box position="relative">
      <UI.Button
        position="absolute"
        top={2}
        right={2}
        onClick={onRemoveClick}
        size="xs"
        colorScheme="red"
      >
        Delete
      </UI.Button>

      {item.data.type === 'text' ? (
        <React.Fragment>
          {item.data.text.html ? (
            <HTMLTextItem {...itemProps} />
          ) : (
            <PlainTextItem {...itemProps} />
          )}
        </React.Fragment>
      ) : null}
      {item.data.type === 'image' ? <ImageItem {...itemProps} /> : null}
      {item.data.type === 'url' ? <URLItem {...itemProps} /> : null}
      {item.data.type === 'player' ? <PlayerItem {...itemProps} /> : null}
    </UI.Box>
  );
};

export default PastedItemView;
