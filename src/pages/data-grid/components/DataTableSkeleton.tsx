import * as UI from '@chakra-ui/react';
import _ from 'lodash';

/**
 * A diplay component for skeleton rows in a table using ChakraUI.
 */
export function DataTableSkeleton({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}): JSX.Element {
  return (
    <UI.Tbody>
      {_.times(rows, (i) => (
        <UI.Tr key={i}>
          {_.times(columns, (j) => {
            return (
              <UI.Td key={j}>
                <UI.Box
                  bg="gray.100"
                  borderRadius="md"
                  color="gray.100"
                  _after={{
                    content: '"—"',
                    display: 'block',
                  }}
                />
              </UI.Td>
            );
          })}
        </UI.Tr>
      ))}
    </UI.Tbody>
  );
}
