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
    Chip
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { isElectron } from '../../utils/electronPrint';

const PrinterSettings = ({ open, onClose }) => {
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState('');
    const [currentPrinter, setCurrentPrinter] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        if (open && isElectron()) {
            loadPrinters();
            loadCurrentConfig();
        }
    }, [open]);

    const loadPrinters = async () => {
        setLoading(true);
        try {
            const printerList = await window.electronPOS.listPrinters();
            setPrinters(printerList);
        } catch (error) {
            console.error('Failed to load printers:', error);
            setSaveStatus({ type: 'error', message: 'Failed to load printers' });
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
                setSaveStatus({ type: 'success', message: 'Printer saved successfully!' });
                
                // Auto-close after 2 seconds
                setTimeout(() => {
                    onClose();
                    setSaveStatus(null);
                }, 2000);
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
            const testContent = `
                <html>
                <head>
                    <title>Test Print</title>
                    <style>
                        @media print {
                            @page { margin: 0; }
                            body { margin: 10px; font-family: monospace; font-size: 12px; }
                        }
                    </style>
                </head>
                <body>
                    <pre>
================================
        TEST PRINT
================================
Printer: ${selectedPrinter}
Date: ${new Date().toLocaleString()}
================================
If you can read this, your
printer is working correctly!
================================
                    </pre>
                </body>
                </html>
            `;

            await window.electronPOS.printNow({ deviceName: selectedPrinter });
            setSaveStatus({ type: 'success', message: 'Test print sent!' });
        } catch (error) {
            console.error('Test print failed:', error);
            setSaveStatus({ type: 'error', message: 'Test print failed: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isElectron()) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Printer Settings</DialogTitle>
                <DialogContent>
                    <Alert severity="info">
                        Printer settings are only available in the Electron desktop app.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <PrintIcon />
                    Printer Settings
                </Box>
            </DialogTitle>
            <DialogContent>
                {loading && printers.length === 0 ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {currentPrinter && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Current printer: <strong>{currentPrinter}</strong>
                            </Alert>
                        )}

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Default Printer</InputLabel>
                            <Select
                                value={selectedPrinter}
                                onChange={(e) => setSelectedPrinter(e.target.value)}
                                label="Select Default Printer"
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
                    disabled={loading || !selectedPrinter}
                    variant="outlined"
                >
                    Test Print
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading || !selectedPrinter}
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
