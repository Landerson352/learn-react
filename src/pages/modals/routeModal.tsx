// For use only with react-router
// https://reactrouter.com/en/main/hooks/use-params
// https://reactrouter.com/en/main/hooks/use-navigate

import * as UI from '@chakra-ui/react';
import * as reactRouter from 'react-router-dom';
import _ from 'lodash';

const modalPath = 'modal';

export const createModalPath = (relativeTo: string = '/') => {
  return _.trimEnd(relativeTo, '/') + '/' + modalPath + '/:modal';
};

export const useRouteModal = (
  modalSegment?: string
): [Pick<UI.UseDisclosureReturn, 'isOpen' | 'onOpen' | 'onClose'>, string] => {
  const params = reactRouter.useParams<{ modal: string }>();
  const navigate = reactRouter.useNavigate();
  const isOpen = modalSegment ? params.modal === modalSegment : true;
  const href = modalPath + '/' + modalSegment;

  const onOpen = () => {
    if (modalSegment && !isOpen) {
      navigate(href);
    }
  };
  const onClose = () => {
    if (isOpen) {
      navigate('./../..');
    }
  };

  return [
    {
      isOpen,
      onOpen,
      onClose,
    },
    href,
  ];
};
