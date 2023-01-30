import * as UI from '@chakra-ui/react';
import React from 'react';
import Camera from 'react-html5-camera-photo';

import 'react-html5-camera-photo/build/css/index.css';

export const CameraInput: React.FC<
  Omit<UI.InputProps, 'value'> & {
    value: string | undefined;
    onValueChange(str: string | undefined): any;
  }
> = ({ value, onValueChange, ...restProps }) => {
  const modal = UI.useDisclosure();

  const handleCameraTakePhoto = (dataUri: string) => {
    modal.onClose();
    onValueChange(dataUri);
  };

  return (
    <React.Fragment>
      <UI.Input type="hidden" value={value} {...restProps} />
      <UI.VStack
        alignItems="start"
        sx={{
          /* Make the button red when the input is invalid */
          '[aria-invalid] + & button': {
            bg: 'red.500',
            color: 'white',
          },
        }}
      >
        {value ? <UI.Image maxW="full" borderRadius="lg" src={value} /> : null}
        <UI.HStack>
          <UI.Button onClick={modal.onOpen}>
            {value ? 'Retake photo' : 'Take photo'}
          </UI.Button>
          {value ? (
            <UI.Button onClick={() => onValueChange(undefined)}>
              Remove
            </UI.Button>
          ) : null}
        </UI.HStack>
      </UI.VStack>
      <UI.Modal {...modal} size="full">
        <UI.ModalOverlay />
        <UI.ModalContent
          justifyContent="center"
          alignItems="center"
          sx={{
            '& video': {
              borderRadius: 'lg',
            },
          }}
        >
          <UI.ModalCloseButton />
          <Camera isSilentMode onTakePhoto={handleCameraTakePhoto} />
        </UI.ModalContent>
      </UI.Modal>
    </React.Fragment>
  );
};
