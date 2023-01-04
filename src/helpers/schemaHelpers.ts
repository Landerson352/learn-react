import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';
import * as zod from 'zod';

/**
 * Utilities for generating table columns and form fields from a zod schema
 * The order is: zod --> form fields --> table columns
 */

type TypeString = 'text' | 'number' | 'date' | 'boolean';

export const getTypeStringFromZod = (type: zod.ZodTypeAny): TypeString => {
  const innerType = type._def.innerType;
  if (innerType instanceof zod.ZodString) {
    return 'text';
  } else if (innerType instanceof zod.ZodNumber) {
    return 'number';
  } else if (innerType instanceof zod.ZodDate) {
    return 'date';
  } else if (innerType instanceof zod.ZodBoolean) {
    return 'boolean';
  } else {
    return 'text';
  }
};

export type Field<T> = {
  id: keyof T & string;
  label: string;
  type: TypeString;
  helpText?: string;
  options?: { label: string; value: string }[];
  control?: 'select' | 'checkbox' | 'radio' | 'textarea';
  expectedLength?: number;
  group?: string;
  tableColumn?: Partial<Record<keyof T, ReactTable.IdentifiedColumnDef<T>>>;
};

export type Fields<T> = Field<T>[];

export type Metas<T> = Partial<Record<keyof T, Partial<Field<T>>>>;

export const createFields = <K extends zod.AnyZodObject>(
  validator: K,
  metas?: Metas<zod.infer<K>>
) => {
  type Entity = zod.infer<K>;
  const result: Fields<Entity> = [];
  for (let key of Object.keys(validator.shape)) {
    const type = getTypeStringFromZod(validator.shape[key]);
    const fallbackLabel = _.capitalize(_.trimStart(_.lowerCase(key), 'is '));
    result.push(
      _.merge(
        {
          id: key,
          label: fallbackLabel,
          type: type,
        },
        metas?.[key],
        metas?.[key]?.tableColumn?.meta
      )
    );
  }
  return result;
};

export type Columns<T> = ReactTable.ColumnDef<T, string | number | undefined>[];

export const createColumns = <K extends zod.AnyZodObject>(
  validator: K,
  metas?: Metas<zod.infer<K>>
) => {
  const fields = createFields(validator, metas);

  const columnHelper = ReactTable.createColumnHelper<zod.infer<K>>();
  const result: ReactTable.ColumnDef<
    zod.infer<K>,
    string | number | undefined
  >[] = [];
  for (let field of fields) {
    result.push(
      columnHelper.accessor(
        // @ts-ignore
        field.id,
        _.merge(
          {
            id: field.id,
            header: field.label,
          },
          field.tableColumn,
          {
            meta: _.merge(
              {
                label: field.label,
                type: field.type,
                isNumeric: field.type === 'number',
              },
              field,
              field.tableColumn?.meta
            ),
          }
        )
      )
    );
  }
  return result;
};

export function createColumnsGetter<T>(columns: Columns<T>) {
  // Returns a list of personColumns filtered by the given keys
  return (filterKeys: (keyof T)[]) => {
    return columns.filter((column) => {
      return filterKeys.includes((column.meta as Field<T>).id);
    });
  };
}

export function createFieldsGetter<T>(fields: Fields<T>) {
  // Returns a list of personColumns filtered by the given keys
  return (filterKeys: (keyof T)[]) => {
    return fields.filter((field) => {
      return filterKeys.includes(field.id);
    });
  };
}
