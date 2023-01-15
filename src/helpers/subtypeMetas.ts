import { createDefaultMaskGenerator } from 'react-hook-mask';

export const subtypeMetas = {
  currency: {
    format: (value: string) => {
      const number = Number(value);
      if (isNaN(number)) {
        return value;
      }
      return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    },
  },
  ein: {
    mask: createDefaultMaskGenerator('99-9999999'),
    format: (value: string) => {
      return value.replace(/(\d{2})(\d{7})/, '$1-$2');
    },
  },
  email: {},
  phone: {
    mask: createDefaultMaskGenerator('(999) 999-9999'),
    format: (value: string) => {
      return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },
  },
  ssn: {
    mask: createDefaultMaskGenerator('999-99-9999'),
    format: (value: string) => {
      return value.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
    },
  },
  zip: {
    mask: createDefaultMaskGenerator('99999-9999'),
    format: (value: string) => {
      return value.replace(/(\d{5})(\d{4})/, '$1-$2');
    },
  },
};

export type SubtypeMetaKey = keyof typeof subtypeMetas;
