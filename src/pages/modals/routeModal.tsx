// For use only with react-router
// https://reactrouter.com/en/main/hooks/use-params
// https://reactrouter.com/en/main/hooks/use-navigate

import * as UI from '@chakra-ui/react';
import * as reactRouter from 'react-router-dom';

const modalPath = 'modal';

export const useRouteModal = (
  modalSegment?: string
): [Pick<UI.UseDisclosureReturn, 'isOpen' | 'onOpen' | 'onClose'>, string] => {
  const trailingSegments = (
    reactRouter.useParams<{ ['*']: string }>()['*'] || ''
  ).split('/');
  const paramsModal =
    trailingSegments[0] === modalPath ? trailingSegments[1] : '';
  const navigate = reactRouter.useNavigate();
  const isOpen = modalSegment ? paramsModal === modalSegment : true;
  const href = modalPath + '/' + modalSegment;

  const onOpen = () => {
    if (modalSegment && !isOpen) {
      navigate(href);
    }
  };
  const onClose = () => {
    if (isOpen) {
      navigate('./');
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
