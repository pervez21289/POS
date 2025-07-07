// project imports
import getColors from 'utils/getColors';
import getShadow from 'utils/getShadow';

// ==============================|| OVERRIDES - INPUT BORDER & SHADOWS ||============================== //

function getColor({ variant, theme }) {
    const colors = getColors(theme, variant);
    const { light, main } = colors;
    const shadows = getShadow(theme, `${variant}`);

    return {
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: main, boxShadow: shadows },
        '&.Mui-focused': {
            boxShadow: shadows,
            '& .MuiOutlinedInput-notchedOutline': { border: '2px solid', borderColor: main }
        }
    };
}

// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(theme) {
    return {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                    ...getColor({ variant: 'primary', theme }),
                    '&.Mui-error': { ...getColor({ variant: 'error', theme }) },
                    '&.Mui-disabled': {
                        backgroundColor: theme.palette.action.disabledBackground,
                        color: theme.palette.text.disabled
                    }
                },
                input: {
                    padding: '12px 14px',
                    fontSize: '1rem',
                    color: theme.palette.text.primary
                },
                notchedOutline: {
                    borderColor: theme.palette.grey[300]
                },
                inputSizeSmall: {
                    padding: '8px 10px',
                    fontSize: '0.95rem'
                },
                inputMultiline: {
                    padding: 0
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
                fullWidth: true
            }
        }
    };
}