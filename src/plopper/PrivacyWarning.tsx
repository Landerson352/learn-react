import React from 'react';
import * as UI from '@chakra-ui/react';

const PrivacyWarning: React.FC = () => {
  return (
    <UI.Alert
      bg="orange.200"
      color="orange.800"
      justifyContent="center"
      fontWeight="medium"
      fontSize="sm"
    >
      <UI.Text textAlign="center">
        This is an early prototype app with very loose privacy rules. Please do
        not paste any secure or private information.
      </UI.Text>
    </UI.Alert>
  );
};

export default PrivacyWarning;
