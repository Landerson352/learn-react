import * as UI from '@chakra-ui/react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import * as ReactTable from '@tanstack/react-table';

import { DebouncedInput } from '../../../components/DebouncedInput';
import { ComponentOverride } from '../../../helpers/componentOverride';

export const INPUT_DEBOUNCE_MS = 500;

export type DataTableGlobalFilterProps<Data extends object> = {
  table: ReactTable.Table<Data>;
  icon?: ComponentOverride<FontAwesomeIconProps>;
  input?: ComponentOverride<UI.InputProps>;
} & UI.BoxProps;

/**
 * A display component for filtering a table using react-table + ChakraUI.
 */
export function DataTableGlobalFilter<Data extends object>({
  table,
  icon,
  input,
  ...boxProps
}: DataTableGlobalFilterProps<Data>): JSX.Element {
  return (
    <UI.Box {...boxProps}>
      {input === false ? null : (
        <DebouncedInput
          {...input}
          value={table.getState().globalFilter}
          onChange={table.setGlobalFilter}
          leftIcon={
            icon === false
              ? undefined
              : {
                  icon: faSearch,
                  ...icon,
                }
          }
        />
      )}
    </UI.Box>
  );
}
