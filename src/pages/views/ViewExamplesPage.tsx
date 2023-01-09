import * as UI from '@chakra-ui/react';
import React from 'react';

import { View } from './components/View';

const ViewExamplesPage: React.FC = () => {
  return (
    <View key="fullscreen-root" debug w="100vw" h="100vh">
      <View>Elastic element</View>
      <View flex="2 2 auto">Double height</View>
      <View flexDirection="row">
        <View>Elastic row element</View>
        <View flex="2 2 auto">Double width</View>
      </View>
      <View>
        <View rigid>
          <UI.Box h="2000px">Vertical scrolling</UI.Box>
        </View>
      </View>
      <View flexDirection="row">
        <View rigid>
          <UI.Box w="10000px">Horizontal scrolling</UI.Box>
        </View>
      </View>
    </View>
  );
};

export default ViewExamplesPage;
