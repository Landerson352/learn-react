import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';
import { MaskGenerator } from 'react-hook-mask';
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
  tableColumn?: Partial<Record<keyof T, ReactTable.IdentifiedColumnDef<T>>>;
  options?: { label: string; value: string }[] | boolean;
  placeholder?: string;
  trueStateLabel?: string;
  multiline?: boolean;
  group?: string;
  size?: 'sm' | 'md' | 'lg';
  control?: 'switch';
  mask?: MaskGenerator;
  required?: boolean;
};

export type Fields<T> = Field<T>[];

export type Meta<T> = Partial<Record<keyof T, Partial<Field<T>>>>;

export type Metas<T> = Meta<T>;

export const createFields = <K extends zod.AnyZodObject>(
  validator: K,
  metas?: Metas<zod.infer<K>>
) => {
  type Entity = zod.infer<K>;
  const result: Fields<Entity> = [];
  for (let key of Object.keys(validator.shape)) {
    const type = getTypeStringFromZod(validator.shape[key]);
    const fallbackLabel = _.capitalize(_.lowerCase(key));
    const required = !validator.shape[key].safeParse(undefined).success;
    result.push(
      _.merge(
        {
          id: key,
          label: fallbackLabel,
          type: type,
          required,
        },
        metas?.[key],
        metas?.[key]?.tableColumn?.meta
      )
    );
  }
  return result;
};

export type Column<T> = ReactTable.ColumnDef<T, string | number | undefined>;

export type Columns<T> = Column<T>[];

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
    return filterKeys.map((key) => {
      return columns.find((column) => {
        return (column.meta as Field<T>).id === key;
      }) as Column<T>;
    });
  };
}

export function createFieldsGetter<T>(fields: Fields<T>) {
  // Returns a list of personColumns filtered by the given keys
  return (filterKeys: (keyof T)[]) => {
    return filterKeys.map((key) => {
      return fields.find((field) => {
        return field.id === key;
      }) as Field<T>;
    });
  };
}
