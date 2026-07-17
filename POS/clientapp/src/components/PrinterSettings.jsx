import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Box,
    Typography,
    Chip,
    Divider,
    Stack,
    TextField,
    Switch,
    FormControlLabel
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

const SERVICE_URL = 'http://localhost:3001';

// Common fonts available on most Windows systems
const FONT_OPTIONS = [
    'Courier New',
    'Consolas',
    'Lucida Console',
    'Arial',
    'Tahoma',
    'Verdana',
    'Times New Roman',
    'Georgia'
];

const PrinterSettings = ({ open, onClose }) => {
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState('');
    const [currentPrinter, setCurrentPrinter] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [serviceOnline, setServiceOnline] = useState(null);

    // Print configuration state
    const [printConfig, setPrintConfig] = useState({
        fontSize: 10,
        pageSize: '58mm',
        fontFamily: 'Courier New',
        bold: true
    });

    useEffect(() => {
        if (open) {
            checkService();
            loadStoredConfig();
        }
    }, [open]);

    const checkService = async () => {
        setLoading(true);
        setSaveStatus(null);
        try {
            const response = await fetch(`${SERVICE_URL}/api/health`);
            if (response.ok) {
                setServiceOnline(true);
                await loadPrinters();
                await loadStoredPrinter();
            } else {
                setServiceOnline(false);
                setSaveStatus({ type: 'error', message: 'Print service is not responding.' });
            }
        } catch (error) {
            setServiceOnline(false);
            setSaveStatus({ type: 'error', message: 'Cannot connect to print service.' });
        } finally {
            setLoading(false);
        }
    };

    const loadPrinters = async () => {
        try {
            const response = await fetch(`${SERVICE_URL}/api/printers`);
            if (!response.ok) throw new Error('Failed to fetch printers');
            const data = await response.json();
            setPrinters(data.printers || []);
            if (data.printers?.length === 0) {
                setSaveStatus({ type: 'warning', message: 'No printers found. Please connect a printer.' });
            }
        } catch (error) {
            console.error('Failed to load printers:', error);
            setSaveStatus({ type: 'error', message: 'Failed to load printers: ' + error.message });
        }
    };

    const loadStoredPrinter = () => {
        const stored = localStorage.getItem('pos_default_printer');
        if (stored) {
            setCurrentPrinter(stored);
            setSelectedPrinter(stored);
        }
    };

    const loadStoredConfig = () => {
        try {
            const stored = localStorage.getItem('pos_print_config');
            if (stored) {
                const config = JSON.parse(stored);
                setPrintConfig({
                    fontSize: config.fontSize || 10,
                    pageSize: config.pageSize || '58mm',
                    fontFamily: config.fontFamily || 'Courier New',
                    bold: config.bold !== undefined ? config.bold : true
                });
            }
        } catch (error) {
            console.error('Failed to load stored config:', error);
        }
    };

    const saveStoredConfig = () => {
        localStorage.setItem('pos_print_config', JSON.stringify(printConfig));
    };

    const handleSave = () => {
        if (!selectedPrinter) {
            setSaveStatus({ type: 'error', message: 'Please select a printer' });
            return;
        }

        localStorage.setItem('pos_default_printer', selectedPrinter);
        saveStoredConfig();

        setCurrentPrinter(selectedPrinter);
        setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });

        setTimeout(() => {
            onClose();
            setSaveStatus(null);
        }, 2000);
    };

    const handleTestPrint = async () => {
        if (!selectedPrinter) {
            setSaveStatus({ type: 'error', message: 'Please select a printer first' });
            return;
        }

        setLoading(true);
        setSaveStatus(null);

        try {
            const testText = `================================
        TEST PRINT
================================
Printer: ${selectedPrinter}
Date: ${new Date().toLocaleString()}
================================
If you can read this, your
printer is working correctly!
================================
`;

            const response = await fetch(`${SERVICE_URL}/api/print`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: [{
                        type: 'text',
                        value: testText,
                        style: { fontSize: '12px', fontFamily: 'monospace' }
                    }],
                    printerName: selectedPrinter,
                    config: printConfig // send current config
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Test print failed');
            }

            const result = await response.json();
            if (result.success) {
                setSaveStatus({ type: 'success', message: 'Test print sent!' });
            } else {
                throw new Error(result.error || 'Test print failed');
            }
        } catch (error) {
            console.error('Test print failed:', error);
            setSaveStatus({ type: 'error', message: 'Test print failed: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <PrintIcon />
                    Printer Settings
                </Box>
            </DialogTitle>
            <DialogContent>
                {loading && serviceOnline === null ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : serviceOnline === false ? (
                    <Box>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Print service is not running.
                        </Alert>
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={checkService}
                            fullWidth
                        >
                            Retry Connection
                        </Button>
                    </Box>
                ) : (
                    <>
                        {currentPrinter && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Current printer: <strong>{currentPrinter}</strong>
                            </Alert>
                        )}

                        {printers.length === 0 && !loading && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                No printers found. Please connect a printer and refresh.
                            </Alert>
                        )}

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Default Printer</InputLabel>
                            <Select
                                value={selectedPrinter}
                                onChange={(e) => setSelectedPrinter(e.target.value)}
                                label="Select Default Printer"
                                disabled={printers.length === 0}
                            >
                                {printers.map((printer) => (
                                    <MenuItem key={printer.name} value={printer.name}>
                                        <Box display="flex" alignItems="center" gap={1} width="100%">
                                            {printer.name}
                                            {printer.isDefault && (
                                                <Chip
                                                    label="System Default"
                                                    size="small"
                                                    color="primary"
                                                    icon={<CheckCircleIcon />}
                                                />
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>
                            Print Settings
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <TextField
                                label="Font Size"
                                type="number"
                                value={printConfig.fontSize}
                                onChange={(e) => setPrintConfig({ ...printConfig, fontSize: parseInt(e.target.value) || 10 })}
                                size="small"
                                sx={{ width: 100 }}
                                inputProps={{ min: 8, max: 20 }}
                            />
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Paper Size</InputLabel>
                                <Select
                                    value={printConfig.pageSize}
                                    onChange={(e) => setPrintConfig({ ...printConfig, pageSize: e.target.value })}
                                    label="Paper Size"
                                >
                                    <MenuItem value="58mm">58mm</MenuItem>
                                    <MenuItem value="80mm">80mm</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <FormControl size="small" sx={{ minWidth: 180 }}>
                                <InputLabel>Font Family</InputLabel>
                                <Select
                                    value={printConfig.fontFamily}
                                    onChange={(e) => setPrintConfig({ ...printConfig, fontFamily: e.target.value })}
                                    label="Font Family"
                                >
                                    {FONT_OPTIONS.map((font) => (
                                        <MenuItem key={font} value={font}>
                                            {font}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={printConfig.bold}
                                        onChange={(e) => setPrintConfig({ ...printConfig, bold: e.target.checked })}
                                        size="small"
                                    />
                                }
                                label="Bold"
                                sx={{ ml: 0 }}
                            />
                        </Stack>

                        {selectedPrinter && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Selected: <strong>{selectedPrinter}</strong>
                                </Typography>
                            </Box>
                        )}

                        {saveStatus && (
                            <Alert severity={saveStatus.type} sx={{ mt: 2 }}>
                                {saveStatus.message}
                            </Alert>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleTestPrint}
                    disabled={loading || !selectedPrinter || printers.length === 0}
                    variant="outlined"
                >
                    Test Print
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading || !selectedPrinter || printers.length === 0}
                    variant="contained"
                    color="primary"
                >
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PrinterSettings;