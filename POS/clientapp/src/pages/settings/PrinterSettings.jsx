import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Alert,
    CircularProgress,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { isElectron } from '../../utils/electronPrint';

export default function PrinterSettingsPage() {
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState('');
    const [currentPrinter, setCurrentPrinter] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        if (isElectron()) {
            loadPrinters();
            loadCurrentConfig();
        }
    }, []);

    const loadPrinters = async () => {
        setLoading(true);
        try {
            const printerList = await window.electronPOS.listPrinters();
            setPrinters(printerList);
            console.log('Available printers:', printerList);
        } catch (error) {
            console.error('Failed to load printers:', error);
            setSaveStatus({ type: 'error', message: 'Failed to load printers: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const loadCurrentConfig = async () => {
        try {
            const result = await window.electronPOS.getDefaultPrinter();
            if (result.printerName) {
                setCurrentPrinter(result.printerName);
                setSelectedPrinter(result.printerName);
            }
        } catch (error) {
            console.error('Failed to load current config:', error);
        }
    };

    const handleSave = async () => {
        if (!selectedPrinter) {
            setSaveStatus({ type: 'error', message: 'Please select a printer' });
            return;
        }

        setLoading(true);
        setSaveStatus(null);

        try {
            const result = await window.electronPOS.savePrinterConfig({
                defaultPrinter: selectedPrinter
            });

            if (result.success) {
                setCurrentPrinter(selectedPrinter);
                setSaveStatus({
                    type: 'success',
                    message: 'Printer saved successfully! Bills will now print directly to this printer.'
                });
            } else {
                setSaveStatus({ type: 'error', message: 'Failed to save printer configuration' });
            }
        } catch (error) {
            console.error('Error saving printer:', error);
            setSaveStatus({ type: 'error', message: 'Error: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleTestPrint = async () => {
        if (!selectedPrinter) {
            setSaveStatus({ type: 'error', message: 'Please select a printer first' });
            return;
        }

        setLoading(true);
        setSaveStatus(null);

        try {
            await window.electronPOS.printNow({ deviceName: selectedPrinter });
            setSaveStatus({ type: 'success', message: 'Test print sent to ' + selectedPrinter });
        } catch (error) {
            console.error('Test print failed:', error);
            setSaveStatus({ type: 'error', message: 'Test print failed: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isElectron()) {
        return (
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Alert severity="info">
                        <Typography variant="h6" gutterBottom>
                            Printer Settings Not Available
                        </Typography>
                        <Typography>
                            Printer settings are only available in the Electron desktop application.
                            Please use the desktop app to configure your thermal printer for direct printing.
                        </Typography>
                    </Alert>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <SettingsIcon fontSize="large" color="primary" />
                    <Typography variant="h4">Printer Settings</Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Alert severity="info" sx={{ mb: 3 }}>
                    Configure your default thermal printer for direct printing without dialogs.
                    Once set, all bills will automatically print to this printer.
                </Alert>

                {currentPrinter && (
                    <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            <strong>Current Default Printer:</strong>
                        </Typography>
                        <Typography variant="h6">{currentPrinter}</Typography>
                    </Alert>
                )}

                {loading && printers.length === 0 ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading printers...</Typography>
                    </Box>
                ) : (
                    <>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Select Default Printer</InputLabel>
                            <Select
                                value={selectedPrinter}
                                onChange={(e) => setSelectedPrinter(e.target.value)}
                                label="Select Default Printer"
                            >
                                {printers.map((printer) => (
                                    <MenuItem key={printer.name} value={printer.name}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                            <Typography>{printer.name}</Typography>
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

                        {selectedPrinter && (
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Selected Printer:
                                </Typography>
                                <Typography variant="h6">{selectedPrinter}</Typography>
                            </Box>
                        )}

                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={handleTestPrint}
                                disabled={loading || !selectedPrinter}
                                fullWidth
                            >
                                Test Print
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={loading || !selectedPrinter}
                                fullWidth
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save as Default'}
                            </Button>
                        </Stack>

                        {saveStatus && (
                            <Alert severity={saveStatus.type}>
                                {saveStatus.message}
                            </Alert>
                        )}

                        <Divider sx={{ my: 3 }} />

                        <Box>
                            <Typography variant="h6" gutterBottom>
                                How it works:
                            </Typography>
                            <Typography variant="body2" component="div">
                                <ul>
                                    <li>Select your thermal printer from the dropdown above</li>
                                    <li>Click "Test Print" to verify the printer is working</li>
                                    <li>Click "Save as Default" to set it as your default printer</li>
                                    <li>All bills will now print directly without showing a dialog</li>
                                    <li>You can change the printer anytime by coming back to this page</li>
                                </ul>
                            </Typography>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
}
