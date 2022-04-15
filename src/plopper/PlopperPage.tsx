import React from 'react';
import * as UI from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import { useAuthState } from '../auth';
import { SignInButton, SignOutButton } from '../auth/AuthButton';
import PrivacyWarning from './PrivacyWarning';
import PlopperProvider from './PlopperProvider';
import GetStartedTips from './GetStartedTips';
import PastedItemGrid from './PastedItemGrid';

const PlopperPage: React.FC = () => {
  const [user, loading, error] = useAuthState();

  if (loading || error) return null;

  const heading = (
    <UI.SimpleGrid columns={3} alignItems="center" color="white">
      <UI.Box />
      <UI.Heading textAlign="center" my={4} color="gray.500">
        plopper.
      </UI.Heading>
      <UI.Box textAlign="right" px={4}>
        {user ? (
          <SignOutButton
            colorScheme="black"
            variant="outline"
            borderColor="gray.600"
            size="sm"
          >
            Sign out{' '}
            <UI.Text color="gray.500" ml={2}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </UI.Text>
          </SignOutButton>
        ) : null}
      </UI.Box>
    </UI.SimpleGrid>
  );

  return user ? (
    <React.Fragment>
      <PrivacyWarning />
      {heading}
      <PlopperProvider>
        <UI.Box p={4}>
          <PastedItemGrid />
          <GetStartedTips maxWidth="420px" mx="auto" mt={8} />
        </UI.Box>
      </PlopperProvider>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {heading}
      <UI.Box textAlign="center" p={4}>
        <SignInButton colorScheme="green">
          <UI.Text color="green.300" mr={3}>
            <FontAwesomeIcon icon={faGoogle} />
          </UI.Text>
          Sign in with Google
        </SignInButton>
      </UI.Box>
    </React.Fragment>
  );
};

export default PlopperPage;
