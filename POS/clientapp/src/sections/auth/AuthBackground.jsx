// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ==============================|| AUTH BLUR BACKGROUND ||============================== //

export default function AuthBackground() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                zIndex: -1,
                width: '100%',
                height: 'calc(100vh - 175px)',
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            {/* Blurred white shapes using gradients */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: 300,
                    height: 300,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 80%)',
                    filter: 'blur(80px)',
                    borderRadius: '50%',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '15%',
                    width: 250,
                    height: 250,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 80%)',
                    filter: 'blur(60px)',
                    borderRadius: '50%',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '30%',
                    left: '40%',
                    width: 400,
                    height: 400,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 80%)',
                    filter: 'blur(100px)',
                    borderRadius: '50%',
                }}
            />
        </Box>
    );
}
