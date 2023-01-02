import _ from 'lodash';
import * as zod from 'zod';

export const createColumnGetter = <T extends { shape: object }, K extends any>(
  columns: K[],
  validator: T
) => {
  return (filterKeys?: (keyof T['shape'])[]): K[] => {
    return _.reduce(
      columns,
      (acc, column) => {
        // @ts-ignore
        const key = column.accessorKey as keyof T['shape'] & string;
        if (!filterKeys || filterKeys.includes(key)) {
          acc.push(
            _.merge(
              {
                id: key,
                header: _.startCase(key),
                meta: {
                  // @ts-ignore
                  isNumeric: validator.shape[key] instanceof zod.ZodNumber,
                },
              },
              column
            )
          );
        }
        return acc;
      },
      [] as typeof columns
    );
  };
};
