import { createDefaultMaskGenerator } from 'react-hook-mask';

export const masks = {
  ein: createDefaultMaskGenerator('99-9999999'),
  phone: createDefaultMaskGenerator('(999) 999-9999'),
  ssn: createDefaultMaskGenerator('999-99-9999'),
  zip: createDefaultMaskGenerator('99999-9999'),
};
