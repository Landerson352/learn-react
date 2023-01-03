import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';
import * as zod from 'zod';

export type ColumnMeta<T> = {
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  helpText?: string;
  options?: { label: string; value: string }[];
  control?: 'select' | 'checkbox' | 'radio' | 'textarea';
  expectedLength?: number;
  group?: string;
  tableColumn?: Partial<Record<keyof T, ReactTable.IdentifiedColumnDef<T>>>;
};

export type EntityMeta<T> = Partial<Record<keyof T, Partial<ColumnMeta<T>>>>;

const getTypeString = (type: zod.ZodTypeAny) => {
  if (type instanceof zod.ZodString) {
    return 'text';
  } else if (type instanceof zod.ZodNumber) {
    return 'number';
  } else if (type instanceof zod.ZodDate) {
    return 'date';
  } else if (type instanceof zod.ZodBoolean) {
    return 'boolean';
  } else {
    return 'text';
  }
};

export const createColumnGetter = <K extends zod.AnyZodObject>(
  validator: K,
  metas: EntityMeta<zod.infer<K>>
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
      const fallbackLabel = _.capitalize(_.trimStart(_.lowerCase(key), 'is '));
      result.push(
        columnHelper.accessor(
          // @ts-ignore
          key,
          _.merge(
            {
              id: key,
              header: metas[key]?.label || fallbackLabel,
            },
            metas[key]?.tableColumn,
            {
              meta: _.merge(
                {
                  label: fallbackLabel,
                  type: getTypeString(shape),
                },
                metas[key],
                metas[key]?.tableColumn?.meta
              ),
            }
          )
        )
      );
    }
    return result;
  };
  return getColumns;
};
