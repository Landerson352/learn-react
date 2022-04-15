import React from 'react';
import * as UI from '@chakra-ui/react';
import SanitizedHTML from 'react-sanitized-html';
import sanitizeHTML from 'sanitize-html';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useToggle } from 'react-use';

import { usePlopper } from './PlopperProvider';
import { useCopyPastedDataButtons } from './pastedData';
import { PastedItemDocument } from './pastedItem';
import useInnerElementBackgroundColor from '../helpers/useInnerElementBackgroundColor';

interface PastedItemProps {
  itemDoc: PastedItemDocument;
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
  itemDoc,
  ...wrapperProps
}) => {
  const { ref, backgroundColor } = useInnerElementBackgroundColor(':scope>*>*');

  if (itemDoc.data.type !== 'text') return null;

  return (
    <PastedItemWrapper ref={ref} bg={backgroundColor} {...wrapperProps}>
      <SanitizedHTML
        allowedAttributes={{
          ...sanitizeHTML.defaults.allowedAttributes,
          '*': ['style'],
        }}
        html={itemDoc.data.text.html}
      />
    </PastedItemWrapper>
  );
};

export const PlainTextItem: React.FC<PastedItemProps> = ({
  itemDoc,
  ...wrapperProps
}) => {
  if (itemDoc.data.type !== 'text') return null;

  return (
    <PastedItemWrapper {...wrapperProps}>
      {itemDoc.data.text.plain.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </PastedItemWrapper>
  );
};

export const ImageItem: React.FC<PastedItemProps> = ({
  itemDoc,
  ...wrapperProps
}) => {
  if (itemDoc.data.type !== 'image') return null;

  return (
    <PastedItemWrapper p={0} {...wrapperProps}>
      <UI.Image src={itemDoc.data.src} alt="..." w="100%" />
    </PastedItemWrapper>
  );
};

export const URLItem: React.FC<PastedItemProps> = ({
  itemDoc,
  ...wrapperProps
}) => {
  if (itemDoc.data.type !== 'url') return null;

  const url = new URL(itemDoc.data.url);
  const meta = itemDoc.data.meta;

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
  itemDoc,
  ...wrapperProps
}) => {
  if (itemDoc.data.type !== 'player') return null;

  const playerAspectRatio = 16 / 9;
  const width = wrapperProps.width;
  const height = Math.floor(width / playerAspectRatio);

  return (
    <PastedItemWrapper p={0} {...wrapperProps}>
      <ReactPlayer url={itemDoc.data.url} width={width} height={height} />
    </PastedItemWrapper>
  );
};

export const PastedItemContextMenu: React.FC<
  UI.StackProps & { itemDoc: PastedItemDocument }
> = ({ itemDoc, ...stackProps }) => {
  const pastingContext = usePlopper();
  const [active, toggle] = useToggle(false);
  const buttons = useCopyPastedDataButtons(itemDoc.data);

  const handleDeleteClick = () => pastingContext.remove(itemDoc.id);

  return (
    <UI.Stack direction="row-reverse" spacing={1} {...stackProps}>
      <UI.Button
        size="sm"
        onClick={toggle}
        opacity={0.35}
        _hover={{ opacity: 1 }}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </UI.Button>
      {active ? (
        <React.Fragment>
          {buttons.map((button) => (
            <UI.Button
              key={button.label}
              size="sm"
              onClick={() => {
                button.onClick();
                toggle();
              }}
            >
              {button.label}
            </UI.Button>
          ))}
          <UI.Button size="sm" colorScheme="red" onClick={handleDeleteClick}>
            <FontAwesomeIcon icon={faTrash} />
          </UI.Button>
        </React.Fragment>
      ) : null}
    </UI.Stack>
  );
};

export const PastedItemView: React.FC<PastedItemProps> = ({
  itemDoc,
  ...restProps
}) => {
  const itemProps = { itemDoc, ...restProps };

  return (
    <UI.Box position="relative" _hover={{ '> *': { opacity: 1 } }}>
      <PastedItemContextMenu
        itemDoc={itemDoc}
        position="absolute"
        top={3}
        right={3}
        opacity={0}
      />

      {itemDoc.data.type === 'text' ? (
        <React.Fragment>
          {itemDoc.data.text.html ? (
            <HTMLTextItem {...itemProps} />
          ) : (
            <PlainTextItem {...itemProps} />
          )}
        </React.Fragment>
      ) : null}
      {itemDoc.data.type === 'image' ? <ImageItem {...itemProps} /> : null}
      {itemDoc.data.type === 'url' ? <URLItem {...itemProps} /> : null}
      {itemDoc.data.type === 'player' ? <PlayerItem {...itemProps} /> : null}
    </UI.Box>
  );
};

export default PastedItemView;
