import * as UI from '@chakra-ui/react';
import { Column } from '@tanstack/react-table';
import React from 'react';

import {
  DebouncedInput,
  DebouncedInputProps,
} from '../../../components/DebouncedInput';
import { ComponentOverride } from '../../../helpers/componentOverride';

export type DataTableColumnFilterProps<Data extends object> = {
  column: Column<Data, any>;
  input?: ComponentOverride<DebouncedInputProps>;
};

/**
 * A display component for filtering a column using react-table + ChakraUI.
 */
export function DataTableColumnFilter<Data extends object>({
  column,
  input,
}: DataTableColumnFilterProps<Data>): JSX.Element {
  const meta: any = column.columnDef.meta;
  const columnFilterValue = column.getFilterValue();

  return meta?.isNumeric ? (
    <UI.HStack>
      {input === false ? null : (
        <DebouncedInput
          {...input}
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          minW={14}
          textAlign="right"
        />
      )}
      {input === false ? null : (
        <DebouncedInput
          {...input}
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          minW={14}
          textAlign="right"
        />
      )}
    </UI.HStack>
  ) : (
    <React.Fragment>
      {input === false ? null : (
        <DebouncedInput
          {...input}
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={(value) => column.setFilterValue(value)}
          placeholder="Search"
        />
      )}
    </React.Fragment>
  );
}
