import * as UI from '@chakra-ui/react';
import * as ReactTable from '@tanstack/react-table';
import _ from 'lodash';
import { MaskGenerator } from 'react-hook-mask';
import * as zod from 'zod';

import { setCustomErrorMap } from './setCustomErrorMap';
import { SubtypeMetaKey, subtypeMetas } from './subtypeMetas';

setCustomErrorMap();

/**
 * Utilities for generating table columns and form fields from a zod schema
 * The order is: zod --> form fields --> table columns
 */

type TypeString = 'text' | 'number' | 'date' | 'boolean';

/**
 * Recur into the zod type to find the first primitive used in the chain.
 */
export const getTypeStringFromZod = (type: zod.ZodTypeAny): TypeString => {
  if (type instanceof zod.ZodString) {
    return 'text';
  } else if (type instanceof zod.ZodNumber) {
    return 'number';
  } else if (type instanceof zod.ZodDate) {
    return 'date';
  } else if (type instanceof zod.ZodBoolean) {
    return 'boolean';
  } else {
    return getTypeStringFromZod(
      type._def.schema || type._def.innerType || type._def.options?.[0]
    );
  }
};

export const createOptionalSchema = <T>(schema: zod.ZodType<T>) => {
  // TODO: FInd out how to make this work with Prisma generated types

  // Allow for missing, undefined, null, or empty string
  return schema.nullish().optional().or(zod.literal(''));
};

export type Field<T> = {
  id: keyof T & string;
  label: string;
  type: TypeString;
  helpText?: string;
  tableColumn?: ReactTable.IdentifiedColumnDef<T>;
  options?: { label: string; value: string }[];
  placeholder?: string;
  trueStateLabel?: string;
  trueFalseLabels?: [string, string];
  multiline?: boolean;
  group?: string;
  size?: 'sm' | 'md' | 'lg';
  control?: 'switch';
  required?: boolean;
  mask?: MaskGenerator;
  format?: (value: string) => string;
  dateFormat?: string; // date-fns format, used by ValueDisplay and chakra-dayzed-datepicker
  subtype?: SubtypeMetaKey;
  isNumeric?: boolean;
  cellProps?: (value: any) => UI.TableCellProps;
};

export type Fields<T> = Field<T>[];

export type Meta<T> = Partial<Field<T>>;

export type Metas<T> = Partial<Record<keyof T, Meta<T>>>;

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
    const meta = metas?.[key];
    const subtypeKey = meta?.subtype;

    result.push(
      _.merge(
        {
          id: key,
          label: fallbackLabel,
          type: type,
          required,
        },
        subtypeKey ? subtypeMetas[subtypeKey] : {},
        meta,
        meta?.tableColumn?.meta
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
          field.format
            ? {
                cell: (props: { getValue: () => any }) => {
                  return field.format?.(String(props.getValue()));
                },
              }
            : {},
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
