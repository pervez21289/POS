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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

const SERVICE_URL = import.meta.env.REACT_APP_PRINT_SERVICE_URL || 'http://localhost:3001';

// Common fonts available on most Windows systems.
// NOTE: this only affects single-line text (store name, footer, etc).
// The item/qty/rate/total table always prints in monospace regardless of this
// setting — that's required for the columns to stay aligned on any printer.
const FONT_OPTIONS = [
    'Segoe UI', 'Arial', 'Calibri', 'Roboto', 'Verdana', 'Tahoma',
    'Courier New', 'Consolas', 'Lucida Console',
    'Times New Roman', 'Georgia'
];

// Suggested character width per paper size (56mm rolls are tighter than 58mm).
// These are starting points — actual capacity depends on font size and printer,
// so the field below stays editable.
const PAGE_SIZE_OPTIONS = [
    { value: '56mm', label: '56mm', defaultLineWidth: 26 },
    { value: '58mm', label: '58mm', defaultLineWidth: 32 },
    { value: '80mm', label: '80mm', defaultLineWidth: 48 },
];

const getDefaultLineWidth = (pageSize) =>
    PAGE_SIZE_OPTIONS.find((p) => p.value === pageSize)?.defaultLineWidth || 32;

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
        lineWidth: 32,
        fontFamily: 'Courier New',
        bold: true,
        logoBase64: null,
        paymentQRBase64: null
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
                const pageSize = config.pageSize || '58mm';
                setPrintConfig({
                    fontSize: config.fontSize || 10,
                    pageSize,
                    lineWidth: config.lineWidth || getDefaultLineWidth(pageSize),
                    fontFamily: config.fontFamily || 'Courier New',
                    bold: config.bold !== undefined ? config.bold : true,
                    logoBase64: config.logoBase64 || null,
                    paymentQRBase64: config.paymentQRBase64 || null
                });
            }
        } catch (error) {
            console.error('Failed to load stored config:', error);
        }
    };

    const saveStoredConfig = () => {
        localStorage.setItem('pos_print_config', JSON.stringify(printConfig));
    };

    const handlePageSizeChange = (newPageSize) => {
        setPrintConfig((prev) => ({
            ...prev,
            pageSize: newPageSize,
            // Auto-suggest a width for the new paper size; user can still edit it below.
            lineWidth: getDefaultLineWidth(newPageSize),
        }));
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
        }, 100);
    };

    // ----- Logo Handlers -----
    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result.split(',')[1];
            setPrintConfig({ ...printConfig, logoBase64: base64 });
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleRemoveLogo = () => {
        setPrintConfig({ ...printConfig, logoBase64: null });
    };

    // ----- Payment QR / Image Handlers -----
    const handlePaymentQRUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result.split(',')[1];
            setPrintConfig({ ...printConfig, paymentQRBase64: base64 });
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleRemovePaymentQR = () => {
        setPrintConfig({ ...printConfig, paymentQRBase64: null });
    };

    // ------------------------------------------------------------

    const handleTestPrint = async () => {
        if (!selectedPrinter) {
            setSaveStatus({ type: 'error', message: 'Please select a printer first' });
            return;
        }

        setLoading(true);
        setSaveStatus(null);

        try {
            const width = printConfig.lineWidth || 32;
            const rule = '='.repeat(width);
            const testText = `${rule}
${' '.repeat(Math.max(Math.floor((width - 10) / 2), 0))}TEST PRINT
${rule}
Printer: ${selectedPrinter}
Date: ${new Date().toLocaleString()}
Width: ${width} chars (${printConfig.pageSize})
${rule}
If you can read this clearly,
your printer and paper width
are configured correctly.
${rule}
`;

            const response = await fetch(`${SERVICE_URL}/api/print`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: [{
                        type: 'text',
                        value: testText,
                        style: {
                            fontSize: `${printConfig.fontSize}px`,
                            // Always monospace here too — this is a column-based test
                            // and must reflect the same rendering rule as real receipts.
                            fontFamily: 'monospace',
                            fontWeight: printConfig.bold ? 'bold' : 'normal',
                        }
                    }],
                    printerName: selectedPrinter,
                    config: printConfig // includes logo & payment QR
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

                        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
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
                                    onChange={(e) => handlePageSizeChange(e.target.value)}
                                    label="Paper Size"
                                >
                                    {PAGE_SIZE_OPTIONS.map((p) => (
                                        <MenuItem key={p.value} value={p.value}>
                                            {p.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Line Width (chars)"
                                type="number"
                                value={printConfig.lineWidth}
                                onChange={(e) => setPrintConfig({ ...printConfig, lineWidth: parseInt(e.target.value) || getDefaultLineWidth(printConfig.pageSize) })}
                                size="small"
                                sx={{ width: 150 }}
                                inputProps={{ min: 16, max: 64 }}
                                helperText="Increase/decrease if columns overflow or leave gaps"
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
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
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Font Family applies to single-line text only. Item/Qty table rows
                            always print in monospace so columns stay aligned.
                        </Typography>

                        {/* --- Logo Upload Section --- */}
                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>
                            Company Logo
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                size="small"
                                startIcon={<UploadFileIcon />}
                            >
                                Upload Logo
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleLogoUpload}
                                />
                            </Button>

                            {printConfig.logoBase64 && (
                                <>
                                    <Box
                                        component="img"
                                        src={`data:image/png;base64,${printConfig.logoBase64}`}
                                        alt="Logo preview"
                                        sx={{
                                            height: 40,
                                            maxWidth: 100,
                                            objectFit: 'contain',
                                            border: '1px solid #ddd',
                                            borderRadius: 1,
                                            p: 0.5
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={handleRemoveLogo}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Remove
                                    </Button>
                                </>
                            )}
                        </Stack>

                        {/* --- PAYMENT QR / IMAGE SECTION --- */}
                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>
                            Payment QR / Image (Static)
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                size="small"
                                startIcon={<UploadFileIcon />}
                            >
                                Upload QR/Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handlePaymentQRUpload}
                                />
                            </Button>

                            {printConfig.paymentQRBase64 && (
                                <>
                                    <Box
                                        component="img"
                                        src={`data:image/png;base64,${printConfig.paymentQRBase64}`}
                                        alt="Payment QR preview"
                                        sx={{
                                            height: 40,
                                            maxWidth: 100,
                                            objectFit: 'contain',
                                            border: '1px solid #ddd',
                                            borderRadius: 1,
                                            p: 0.5
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={handleRemovePaymentQR}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Remove
                                    </Button>
                                </>
                            )}
                        </Stack>

                        {selectedPrinter && (
                            <Box sx={{ mb: 2, mt: 2 }}>
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