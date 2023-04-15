import * as UI from '@chakra-ui/react';
import * as icons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { extend, useLoader } from '@react-three/fiber';
import useAxios from 'axios-hooks';
import * as dateFns from 'date-fns';
import * as FramerMotion from 'framer-motion';
import * as FramerMotion3D from 'framer-motion-3d';
import * as Motion from 'motion';
import _ from 'lodash';
import numeral from 'numeral';
import React from 'react';
import * as reactHookForm from 'react-hook-form';
import * as reactRouter from 'react-router-dom';
import * as reactUse from 'react-use';
import * as three from 'three';
import useLocalStorageState from 'use-local-storage-state';
import * as util from 'util';

import { ReactComponent as ReactLogo } from '../images/logo.svg';
import { routes } from '../navigation/routes';
import { RouteTitle } from '../navigation/RouteTitle';

// Wrap components with Framer Motion for use in animated components.
// (You only have to do this once.)
const MotionUI = {
  Box: FramerMotion.motion(UI.Box),
};
// Inject Three.js into React Three Fiber.
// (This should be optimized for production.)
const motion3d = FramerMotion3D.motion;
extend(three);

// https://www.framer.com/docs/
const FramerMotion3DExample: React.FC = () => {
  const green300 = UI.theme.colors.green[300];
  const earthMap = useLoader(
    three.TextureLoader,
    './8k_earth_daymap.jpeg' // cspell:disable-line
  );

  return (
    <UI.Box w="500px" h="500px">
      <FramerMotion3D.MotionCanvas>
        <FramerMotion3D.LayoutCamera position={[0, 0, 6]} />
        {/* <motion3d.ambientLight intensity={0.3} color="magenta" />
        <motion3d.pointLight position={[10, 10, 10]} color="cyan" /> */}
        <motion3d.directionalLight position={[10, 10, 10]} />
        <motion3d.mesh
          animate={{ rotateY: Math.PI * 2 }}
          transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        >
          <motion3d.sphereGeometry args={[2, 24, 12]} />
          {/* <motion3d.meshPhongMaterial flatShading color={green300} /> */}
          <motion3d.meshStandardMaterial flatShading map={earthMap} />
        </motion3d.mesh>
      </FramerMotion3D.MotionCanvas>
    </UI.Box>
  );
};

export const GlobePage: React.FC = () => {
  return (
    <UI.Box bg="black">
      <FramerMotion3DExample />
    </UI.Box>
  );
};

export default GlobePage;
