import React from 'react';
import * as UI from '@chakra-ui/react';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FormError: React.FC<React.PropsWithChildren<UI.AlertProps>> = ({
  children,
  ...restProps
}) => {
  if (!children) return null;

  return (
    <UI.Alert colorScheme="red" borderRadius="lg" {...restProps}>
      <UI.HStack>
        <UI.Text color="red.500" fontSize="xl">
          <FontAwesomeIcon icon={faCircleExclamation} />
        </UI.Text>
        <UI.AlertTitle>{children}</UI.AlertTitle>
      </UI.HStack>
    </UI.Alert>
  );
};
