/**
 * Universal receipt printer - uses HTTP API with full configuration (logo, bold, fonts, static payment QR)
 */

const SERVICE_URL = 'http://localhost:3001';

// ---------- Text formatting helpers ----------
const LINE_WIDTH = 32;

const padRight = (text, length) =>
    (text + ' '.repeat(Math.max(length - text.length, 0))).slice(0, length);

const padLeft = (text, length) =>
    (' '.repeat(Math.max(length - text.length, 0)) + text).slice(-length);

const center = (text) => {
    const space = Math.floor((LINE_WIDTH - text.length) / 2);
    return ' '.repeat(Math.max(space, 0)) + text;
};

const safeText = (text) =>
    (text || '').toString().slice(0, LINE_WIDTH);

// ---------- Receipt text generator ----------
const generateReceiptText = (params) => {
    const { type, storeInfo, items } = params;
    const lines = [];
    console.log('Generating receipt text with params:', params);
    const storeName = storeInfo?.storeName || 'Store Name';
    const address = storeInfo?.address || 'Store Address';
    const gst = storeInfo?.gstin || '-';

    lines.push(center(safeText(storeName)));
    lines.push(center(safeText(address)));
    lines.push(center(`GST: ${safeText(gst)}`));
    lines.push('-'.repeat(LINE_WIDTH));

    if (type === 'summary') {
        const { tableNo } = params;
        lines.push(center('ORDER SUMMARY'));
        lines.push('-'.repeat(LINE_WIDTH));
        lines.push(`Date: ${new Date().toLocaleString()}`);
        lines.push(`Table: ${tableNo || '--'}`);
        lines.push('-'.repeat(LINE_WIDTH));
    } else if (type === 'kot') {
        const { tableNo, kotNo } = params;
        lines.push(center('*** KITCHEN ORDER ***'));
        lines.push('-'.repeat(LINE_WIDTH));
        lines.push(`KOT#: ${kotNo || 'N/A'}`);
        lines.push(`Date: ${new Date().toLocaleString()}`);
        lines.push(`Table: ${tableNo || '--'}`);
        lines.push('-'.repeat(LINE_WIDTH));
    } else if (type === 'sale') {
        const sale = params.sale;
        if (!sale) throw new Error('Sale object is required for type "sale"');
        lines.push(`Bill#: ${sale.billNo || ''}`);
        lines.push(`Date: ${sale.saleTime || ''}`);
        lines.push(`Cashier: ${sale.userName || ''}`);
        if (sale.customerName) lines.push(`Name: ${sale.customerName}`);
        if (sale.mobileNumber) lines.push(`Mobile: ${sale.mobileNumber}`);
        lines.push('-'.repeat(LINE_WIDTH));
    }

    lines.push('Item       Qty   Rt  Total');
    (items || []).forEach(item => {
        lines.push(safeText(item.name));
        const qty = padLeft(item.quantity?.toString() || '0', 2);
        const rate = padLeft(item.price?.toFixed(0) || '0', 4);
        const total = padLeft((item.quantity * item.price).toFixed(0), 7);
        const barcode = padRight(item.barcode || '-', 10);
        lines.push(`${barcode} ${qty} ${rate} ${total}`);
    });

    lines.push('-'.repeat(LINE_WIDTH));

    let subtotal = 0, cgst = 0, sgst = 0, halfGstRate = 0, netAmount = 0;

    if (type === 'summary' || type === 'kot') {
        subtotal = params.subtotal || items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
        netAmount = subtotal;
        const itemCount = params.itemCount || items?.length || 0;
        lines.push(`${padRight('Items:', 14)}${padLeft(itemCount.toString(), 12)}`);
    } else if (type === 'sale') {
        const sale = params.sale;
        subtotal = sale.totalAmount || items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
        cgst = sale.cgst || 0;
        sgst = sale.sgst || 0;
        halfGstRate = sale.halfGstRate || 0;
        netAmount = sale.netAmount || subtotal;
        const itemCount = params.itemCount || items?.length || 0;
        lines.push(`${padRight('Items:', 14)}${padLeft(itemCount.toString(), 12)}`);
    }

    lines.push(`${padRight('Subtotal:', 14)}${padLeft(subtotal.toFixed(2), 12)}`);

    if (type === 'sale' && (cgst > 0 || sgst > 0)) {
        lines.push(`${padRight(`CGST (${halfGstRate.toFixed(2)}%):`, 16)}${padLeft(cgst.toFixed(2), 14)}`);
        lines.push(`${padRight(`SGST (${halfGstRate.toFixed(2)}%):`, 16)}${padLeft(sgst.toFixed(2), 14)}`);
    }

    lines.push('-'.repeat(LINE_WIDTH));

    if (type === 'kot') {
        lines.push(center('=== FOR KITCHEN ==='));
        lines.push(center('Please prepare'));
    } else {
        lines.push(`${padRight('Total Payable:', 16)}${padLeft(`Rs.${netAmount.toFixed(2)}`, 14)}`);
        lines.push('-'.repeat(LINE_WIDTH));
        lines.push(center('Thank you!'));
        lines.push(center('Visit again!'));
    }

    return lines.join('\n');
};

// ---------- HTTP API Calls ----------
async function callApi(endpoint, data) {
    const response = await fetch(`${SERVICE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

// ---------- Storage Helpers ----------
const getStoredPrinter = () => localStorage.getItem('pos_default_printer') || null;

const getStoredConfig = () => {
    try {
        const stored = localStorage.getItem('pos_print_config');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const setStoredPrinter = (printerName) => {
    localStorage.setItem('pos_default_printer', printerName);
};

const setStoredConfig = (config) => {
    localStorage.setItem('pos_print_config', JSON.stringify(config));
};

// ---------- Public API ----------

export const printReceipt = async (params) => {
    const receiptText = generateReceiptText(params);
    const printerName = params.printerName || getStoredPrinter();
    const config = getStoredConfig(); // includes logoBase64 and paymentQRBase64

    const printData = {
        data: [{
            type: 'text',
            value: receiptText,
            style: {
                fontSize: config?.fontSize ? `${config.fontSize}px` : '12px',
                fontFamily: config?.fontFamily || 'monospace',
                whiteSpace: 'pre'
            }
        }],
        printerName: printerName,
        config: config // contains logo and payment QR images (if any)
    };

    try {
        const result = await callApi('/api/print', printData);
        if (result.success) {
            console.log('✅ Receipt printed successfully');
            return result;
        } else {
            throw new Error(result.error || 'Print failed');
        }
    } catch (error) {
        console.error('❌ Print error:', error);
        throw error;
    }
};

export const printRawText = async (text, printerName = null) => {
    try {
        const finalPrinter = printerName || getStoredPrinter();
        const result = await callApi('/api/print-text', { text, printerName: finalPrinter });
        if (result.success) {
            console.log('✅ Raw text printed');
            return result;
        } else {
            throw new Error(result.error || 'Print failed');
        }
    } catch (error) {
        console.error('❌ Raw text print error:', error);
        throw error;
    }
};

export const testPrinter = async (printerName = null) => {
    const finalPrinter = printerName || getStoredPrinter();
    const config = getStoredConfig();

    const testData = {
        data: [{
            type: 'text',
            value: '=== POS58 SYSTEM TEST ===\nSilent native print is live.\n\n\n\n',
            style: { textAlign: 'center', fontSize: '14px' }
        }],
        printerName: finalPrinter,
        config: config // includes logo and payment QR (if uploaded)
    };

    try {
        const result = await callApi('/api/print', testData);
        if (result.success) {
            console.log('✅ Test print successful!');
            return result;
        } else {
            throw new Error(result.error || 'Test failed');
        }
    } catch (error) {
        console.error('❌ Test print error:', error);
        throw error;
    }
};

export const listPrinters = async () => {
    try {
        const response = await fetch(`${SERVICE_URL}/api/printers`);
        return response.json();
    } catch (error) {
        console.error('❌ List printers error:', error);
        throw error;
    }
};

export const setDefaultPrinter = async (printerName) => {
    try {
        const response = await fetch(`${SERVICE_URL}/api/printer/default`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ printerName })
        });
        return response.json();
    } catch (error) {
        console.error('❌ Set default printer error:', error);
        throw error;
    }
};

export const checkService = async () => {
    try {
        const response = await fetch(`${SERVICE_URL}/api/health`);
        return response.ok;
    } catch {
        return false;
    }
};

export { getStoredPrinter, setStoredPrinter, getStoredConfig, setStoredConfig };

export default {
    printReceipt,
    printRawText,
    testPrinter,
    listPrinters,
    setDefaultPrinter,
    checkService,
    getStoredPrinter,
    setStoredPrinter,
    getStoredConfig,
    setStoredConfig
};