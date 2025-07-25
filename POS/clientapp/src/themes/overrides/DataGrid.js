// ==============================|| OVERRIDES - DATA GRID ||============================== //

export default function DataGrid(theme) {
    return {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.common.white,
                    border: `1px solid ${theme.palette.grey[200]}`,
                    '& .MuiDataGrid-withBorderColor': {
                        borderColor: theme.palette.grey[200]
                    }
                },
                columnHeaders: {
                    backgroundColor: theme.palette.common.black,
                    color: theme.palette.common.black,
                    '& .MuiDataGrid-columnSeparator': {
                        color: theme.palette.grey[600]
                    }
                },
                columnHeader: {
                    '&:focus': {
                        outline: 'none'
                    },
                    '&:focus-within': {
                        outline: 'none'
                    }
                },
                columnHeaderTitle: {
                    fontWeight: 600,
                    color: theme.palette.common.black
                },
                menuIcon: {
                    color: theme.palette.common.black
                },
                iconButtonContainer: {
                    color: theme.palette.common.black,
                    '& .MuiButtonBase-root': {
                        color: theme.palette.common.black
                    }
                },
                row: {
                    backgroundColor: theme.palette.common.white,
                    '&:hover': {
                        backgroundColor: theme.palette.grey[50]
                    },
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.grey[100],
                        '&:hover': {
                            backgroundColor: theme.palette.grey[200]
                        }
                    }
                },
                cell: {
                    borderColor: theme.palette.grey[200]
                },
                footerContainer: {
                    borderTop: `1px solid ${theme.palette.grey[200]}`,
                    backgroundColor: theme.palette.grey[50]
                }
            }
        }
    };
}