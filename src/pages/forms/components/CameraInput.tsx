import * as UI from '@chakra-ui/react';
import * as Bowser from 'bowser';
import _ from 'lodash';
import React from 'react';
import Camera from 'react-html5-camera-photo';

import 'react-html5-camera-photo/build/css/index.css';

const getFriendlyErrorMessage = (error: Error) => {
  if (['NotFoundError', 'DevicesNotFoundError'].includes(error.name)) {
    return "We couldn't find a camera to take the photo. Make sure your camera connected and turned on, and try again.";
  }

  if (['NotReadableError', 'TrackStartError'].includes(error.name)) {
    return 'It looks like your camera may be in use by another app. Close any other apps that may be using your camera and try again.';
  }

  if (
    [
      'OverconstrainedError',
      'ConstraintNotSatisfiedError',
      'TypeError',
    ].includes(error.name)
  ) {
    return "It looks like your camera isn't compatible with this site. We don't have a suggestion to fix this error, but you can try again.";
  }

  if (
    [
      'NotAllowedError',
      'PermissionDeniedError',
      'PermissionDismissedError',
    ].includes(error.name)
  ) {
    return "It looks like this site isn't allowed to access your camera. Please allow access to your camera and try again.";
  }

  return "Something went wrong accessing your camera. We don't have a suggestion to fix this error, but you can try again.";
};

const FriendlyCameraError: React.FC<{ error: Error } & UI.StackProps> = ({
  error,
  ...restProps
}) => {
  let additionalElement: React.ReactNode;
  if (
    [
      'NotAllowedError',
      'PermissionDeniedError',
      'PermissionDismissedError',
    ].includes(error.name)
  ) {
    const bowser = Bowser.getParser(window.navigator.userAgent);
    const browser = bowser.getBrowser();
    const os = bowser.getOS();
    const terms = _.compact([
      'allow',
      'site',
      'camera',
      'access',
      browser.name,
      browser.version?.split('.')[0],
      os.name,
    ]);

    const url = `https://www.google.com/search?q=${terms.join('+')}`;
    additionalElement = (
      <UI.Link href={url} target="_blank">
        Search for instructions on how to allow camera access in your browser.
      </UI.Link>
    );
  }

  return (
    <UI.VStack {...restProps}>
      <UI.Text>{getFriendlyErrorMessage(error)}</UI.Text>
      {additionalElement}
    </UI.VStack>
  );
};

export type CameraInputProps = Omit<UI.InputProps, 'value'> & {
  value: string | undefined;
  onChange(str: string | undefined): any;
};
export const CameraInput = React.forwardRef<HTMLInputElement, CameraInputProps>(
  ({ value, onChange, ...restProps }, ref) => {
    const modal = UI.useDisclosure();
    const [error, setError] = React.useState<Error>();

    const handleCameraTakePhoto = (dataUri: string) => {
      modal.onClose();
      onChange(dataUri);
    };

    const handleRetryClick = () => {
      setError(undefined);
    };

    return (
      <React.Fragment>
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
          {value ? (
            <UI.Image maxW="full" borderRadius="lg" src={value} />
          ) : null}
          <UI.HStack>
            <UI.Button onClick={modal.onOpen}>
              {value ? 'Retake photo' : 'Take photo'}
            </UI.Button>
            {value ? (
              <UI.Button onClick={() => onChange(undefined)}>Remove</UI.Button>
            ) : null}
          </UI.HStack>
        </UI.VStack>
        <UI.Modal {...modal} size="full">
          <UI.ModalOverlay />
          <UI.ModalContent
            justifyContent="center"
            alignItems="center"
            bg="black"
            sx={{
              '& video': {
                borderRadius: 'lg',
                objectFit: 'contain',
              },
            }}
          >
            {error ? (
              <UI.VStack maxW="420px" textAlign="center" spacing={6}>
                <FriendlyCameraError error={error} />
                <UI.Button onClick={handleRetryClick}>Retry camera</UI.Button>
                <UI.Button variant="link" size="sm" onClick={modal.onClose}>
                  Cancel
                </UI.Button>
              </UI.VStack>
            ) : (
              <Camera
                onCameraError={(e) => {
                  setError(e);
                }}
                isSilentMode
                isImageMirror
                isFullscreen
                idealFacingMode="user"
                onTakePhoto={handleCameraTakePhoto}
              />
            )}
            <UI.ModalCloseButton color="white" />
          </UI.ModalContent>
        </UI.Modal>
      </React.Fragment>
    );
  }
);
