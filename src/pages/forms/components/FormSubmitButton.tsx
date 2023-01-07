import React from 'react';
import * as UI from '@chakra-ui/react';

export const FormSubmitButton: React.FC<UI.ButtonProps> = (props) => {
  return <UI.Button type="submit" mb={4} children="Submit" {...props} />;
};
