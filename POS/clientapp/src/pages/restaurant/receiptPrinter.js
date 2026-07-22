/**
 * Universal receipt printer - uses HTTP API with full configuration (logo, bold, fonts, static payment QR)
 */

const SERVICE_URL = import.meta.env.REACT_APP_PRINT_SERVICE_URL || 'http://localhost:3001';

// ---------- Text formatting helpers ----------
// 56mm rolls typically fit ~28-32 chars depending on font size; 28 is a safe default.
// Override via config.lineWidth if a specific printer/paper needs more/less.
const DEFAULT_LINE_WIDTH = 28;
const QTY_COL_WIDTH = 3;

// Column-aligned text (padRight/padLeft) is only valid in a TRUE monospace font.
// Named fonts (Tahoma, Arial, even "Courier New" if not installed) can silently
// fall back to a proportional font on the print-service host, breaking alignment
// no matter what name is configured. The CSS generic keyword `monospace` is the
// only choice guaranteed to resolve to *some* real monospace font everywhere.
const PRINT_FONT_FAMILY = 'monospace';

const padRight = (text, length) =>
    (text + ' '.repeat(Math.max(length - text.length, 0))).slice(0, length);

const padLeft = (text, length) =>
    (' '.repeat(Math.max(length - text.length, 0)) + text).slice(-length);

const center = (text, lineWidth) => {
    const space = Math.floor((lineWidth - text.length) / 2);
    return ' '.repeat(Math.max(space, 0)) + text;
};

const safeText = (text, lineWidth) =>
    (text || '').toString().slice(0, lineWidth);

// Accepts either `quantity` or `qty` in case an upstream mapping uses a different key
const getItemQty = (item) => item?.quantity ?? item?.qty ?? 0;

// ---------- Receipt text generator ----------
const generateReceiptText = (params) => {
    const { type, storeInfo, items } = params;
    const config = getStoredConfig();
    // Resolution order: explicit param > stored printer config > safe default
    const lineWidth = params.lineWidth || config?.lineWidth || DEFAULT_LINE_WIDTH;
    const nameColWidth = lineWidth - QTY_COL_WIDTH - 1; // -1 = guaranteed gap before qty

    const lines = [];
    const storeName = storeInfo?.storeName || 'Store Name';
    const address = storeInfo?.address || 'Store Address';
    const gst = storeInfo?.gstin || '-';

    lines.push(center(safeText(storeName, lineWidth), lineWidth));
    lines.push(center(safeText(address, lineWidth), lineWidth));
    lines.push(center(`GST: ${safeText(gst, lineWidth)}`, lineWidth));
    lines.push('-'.repeat(lineWidth));

    if (type === 'summary') {
        const { tableNo } = params;
        lines.push(center('ORDER SUMMARY', lineWidth));
        lines.push('-'.repeat(lineWidth));
        lines.push(`Date: ${new Date().toLocaleString()}`);
        lines.push(`Table: ${tableNo || '--'}`);
        lines.push('-'.repeat(lineWidth));
    } else if (type === 'kot') {
        const { tableNo, kotNo } = params;
        lines.push(center('*** KITCHEN ORDER ***', lineWidth));
        lines.push('-'.repeat(lineWidth));
        lines.push(`KOT#: ${kotNo || 'N/A'}`);
        lines.push(`Date: ${new Date().toLocaleString()}`);
        lines.push(`Table: ${tableNo || '--'}`);
        lines.push('-'.repeat(lineWidth));
    } else if (type === 'sale') {
        const sale = params.sale;
        if (!sale) throw new Error('Sale object is required for type "sale"');
        lines.push(`Bill#: ${sale.billNo || ''}`);
        lines.push(`Date: ${sale.saleTime || ''}`);
        lines.push(`Cashier: ${sale.userName || ''}`);
        if (sale.customerName) lines.push(`Name: ${sale.customerName}`);
        if (sale.mobileNumber) lines.push(`Mobile: ${sale.mobileNumber}`);
        lines.push('-'.repeat(lineWidth));
    }

    // ---------- Item lines ----------
    // KOT is for kitchen staff: show only name + quantity, never price/total.
    // Sale and summary receipts show the full name/rate/total breakdown.
    if (type === 'kot') {
        lines.push(padRight('Item', nameColWidth) + ' ' + padLeft('Qty', QTY_COL_WIDTH));
        (items || []).forEach(item => {
            const qty = padLeft(String(getItemQty(item)), QTY_COL_WIDTH);
            const name = padRight(safeText(item.name, nameColWidth), nameColWidth);
            lines.push(`${name} ${qty}`);
        });
    } else {
        lines.push('Item       Qty   Rt  Total');
        (items || []).forEach(item => {
            lines.push(safeText(item.name, lineWidth));
            const qty = padLeft(String(getItemQty(item)), 2);
            const rate = padLeft(item.price?.toFixed(0) || '0', 4);
            const total = padLeft((getItemQty(item) * item.price).toFixed(0), 7);
            const barcode = padRight(item.barcode || '-', 10);
            lines.push(`${barcode} ${qty} ${rate} ${total}`);
        });
    }

    lines.push('-'.repeat(lineWidth));

    // ---------- Totals ----------
    // KOT never shows money totals — only item count.
    let subtotal = 0, cgst = 0, sgst = 0, halfGstRate = 0, netAmount = 0;
    const itemCount = params.itemCount || items?.length || 0;

    if (type === 'summary') {
        subtotal = params.subtotal || items?.reduce((sum, item) => sum + (item.price * getItemQty(item)), 0) || 0;
        netAmount = subtotal;
        lines.push(`${padRight('Items:', 14)}${padLeft(itemCount.toString(), 12)}`);
    } else if (type === 'kot') {
        lines.push(`${padRight('Items:', 14)}${padLeft(itemCount.toString(), 12)}`);
    } else if (type === 'sale') {
        const sale = params.sale;
        subtotal = parseFloat(sale.totalAmount) || items?.reduce((sum, item) => sum + (item.price * getItemQty(item)), 0) || 0;
        cgst = parseFloat(sale.cgst) || 0;
        sgst = parseFloat(sale.sgst) || 0;
        halfGstRate = parseFloat(sale.halfGstRate) || 0;
        netAmount = parseFloat(sale.netAmount) || subtotal;
        const totalAmount = parseFloat(sale.totalAmount) || subtotal;

        lines.push(`${padRight('Items:', 14)}${padLeft(itemCount.toString(), 12)}`);
        lines.push(`${padRight('Subtotal:', 14)}${padLeft(totalAmount.toFixed(2), 12)}`);
        lines.push(`${padRight(`CGST (${halfGstRate.toFixed(2)}%):`, 16)}${padLeft(cgst.toFixed(2), 14)}`);
        lines.push(`${padRight(`SGST (${halfGstRate.toFixed(2)}%):`, 16)}${padLeft(sgst.toFixed(2), 14)}`);
    }

    lines.push('-'.repeat(lineWidth));

    if (type === 'kot') {
        lines.push(center('=== FOR KITCHEN ===', lineWidth));
        lines.push(center('Please prepare', lineWidth));
    } else {
        if (type === 'summary') {
            lines.push(`${padRight('Subtotal:', 14)}${padLeft(subtotal.toFixed(2), 12)}`);
            lines.push('-'.repeat(lineWidth));
            netAmount = subtotal;
        }
        lines.push(`${padRight('Total Payable:', 16)}${padLeft(`Rs.${netAmount.toFixed(2)}`, 14)}`);
        lines.push('-'.repeat(lineWidth));
        lines.push(center('Thank you!', lineWidth));
        lines.push(center('Visit again!', lineWidth));
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
    const config = getStoredConfig();

    const printData = {
        data: [{
            type: 'text',
            value: receiptText,
            style: {
                fontSize: config?.fontSize ? `${config.fontSize}px` : '12px',
                fontFamily: PRINT_FONT_FAMILY, // always monospace, see comment above
                fontWeight: config?.bold ? 'bold' : 'normal', // ➕ now actually applied
                whiteSpace: 'pre'
            }
        }],
        printerName: printerName,
        config: config
    };

    try {
        const result = await callApi('/api/print', printData);
        if (result.success) {
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