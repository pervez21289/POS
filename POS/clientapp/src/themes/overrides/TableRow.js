// ==============================|| OVERRIDES - TABLE ROW ||============================== //

export default function TableRow() {
  return {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-of-type': {
            '& .MuiTableCell-root': {
              borderBottom: 'none'
            }
          },
          '& .MuiTableCell-root': {
            '&:last-of-type': {
              paddingRight: 1
            },
            '&:first-of-type': {
              paddingLeft: 0
            }
          }
        }
      }
    }
  };
}
