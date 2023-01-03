import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';
import * as zod from 'zod';

export type ColumnMeta = {
  label: string; // TODO: fallback to titleCase(key), will be copied to table header
  type: 'text' | 'number' | 'date' | 'boolean'; // TODO: driven off zod schema
  helpText?: string;
  options?: { label: string; value: string }[];
  control?: 'select' | 'checkbox' | 'radio' | 'textarea';
  expectedLength?: number;
  group?: string;
};

export type EntityMeta<T> = Partial<Record<keyof T, Partial<ColumnMeta>>>;

export type ColumnExtras<T> = Partial<
  Record<keyof T, ReactTable.IdentifiedColumnDef<T>>
>;

export const createColumnGetter = <K extends zod.AnyZodObject>(
  validator: K,
  columnExtras: ColumnExtras<zod.infer<K>>
) => {
  type Entity = zod.infer<K>;

  const getColumns = (filterKeys?: (keyof Entity)[]) => {
    const columnHelper = ReactTable.createColumnHelper<Entity>();
    const result: ReactTable.ColumnDef<Entity, string | number | undefined>[] =
      [];
    for (let key of Object.keys(validator.shape)) {
      if (filterKeys && !filterKeys.includes(key)) {
        continue;
      }

      const shape = validator.shape[key];
      result.push(
        columnHelper.accessor(
          // @ts-ignore
          key,
          _.merge(
            {
              id: key,
              header: _.startCase(key),
              meta: {
                label: _.startCase(key),
                isNumeric: shape instanceof zod.ZodNumber,
              },
            },
            columnExtras[key]
          )
        )
      );
    }
    return result;
  };
  return getColumns;
};
