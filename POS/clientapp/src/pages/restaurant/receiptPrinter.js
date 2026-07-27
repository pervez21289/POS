/**
 * Universal receipt printer - uses HTTP API with full configuration (logo, bold, fonts, static payment QR)
 * Now also supports browser-based printing as a fallback.
 */
import QRCode from 'qrcode';

const SERVICE_URL = import.meta.env.REACT_APP_PRINT_SERVICE_URL || 'http://localhost:3001';

// ---------- Text formatting helpers ----------
const DEFAULT_LINE_WIDTH = 58;
const QTY_COL_WIDTH = 3;

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

const getItemQty = (item) => item?.quantity ?? item?.qty ?? 0;

// ---------- EXPORTED: Receipt text generator ----------
export const generateReceiptText = (params) => {
    const { type, storeInfo, items } = params;
    const config = getStoredConfig();
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

// ---------- NEW: Browser print helper ----------
const PAGE_WIDTH_MM = { '56mm': 56, '58mm': 58, '80mm': 80 };

const escapeHtml = (text) =>
    (text || '')
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

export const printViaBrowser = (content, config = null, isHtml = false) => {
    const win = window.open('', '_blank');
    if (!win) {
        alert('Please allow popups for printing.');
        return;
    }

    const cfg = config || getStoredConfig() || {};
    const pageWidthMm = PAGE_WIDTH_MM[cfg.pageSize] || 58;

    // If content is plain text, wrap it in a pre element
    const bodyContent = isHtml ? content : `<pre style="white-space:pre;font-family:monospace;">${escapeHtml(content)}</pre>`;

    win.document.write(`
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Print Receipt</title>
                <style>
                    @page { size: ${pageWidthMm}mm auto; margin: 0; }
                    html, body { margin: 0; padding: 0; }
                    body { 
                        font-family: ${PRINT_FONT_FAMILY}; 
                        width: ${pageWidthMm}mm; 
                        box-sizing: border-box; 
                        padding: 4px 6px;
                        background: white;
                    }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>${bodyContent}</body>
        </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.onafterprint = () => win.close();
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
const getStoredPrintMethod = () => localStorage.getItem('pos_print_method') || 'service';

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
    const config = getStoredConfig();

    // Browser Print selected in Printer Settings: skip the HTTP print service
    // entirely and open the system print dialog instead. Uses the HTML
    // template (not plain text) so the logo/QR actually render.
    if (getStoredPrintMethod() === 'browser') {
        const receiptHtml = await generateReceiptHTML(params);
        printViaBrowser(receiptHtml, config, true);
        return { success: true, method: 'browser' };
    }

    const receiptText = generateReceiptText(params);
    const printerName = params.printerName || getStoredPrinter();

    const printData = {
        data: [{
            type: 'text',
            value: receiptText,
            style: {
                fontSize: config?.fontSize ? `${config.fontSize}px` : '12px',
                fontFamily: PRINT_FONT_FAMILY,
                fontWeight: config?.bold ? 'bold' : 'normal',
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
    const config = getStoredConfig();

    if (getStoredPrintMethod() === 'browser') {
        printViaBrowser('=== POS58 SYSTEM TEST ===\nBrowser print is live.\n\n\n\n', config);
        return { success: true, method: 'browser' };
    }

    const finalPrinter = printerName || getStoredPrinter();

    const testData = {
        data: [{
            type: 'text',
            value: '=== POS58 SYSTEM TEST ===\nSilent native print is live.\n\n\n\n',
            style: { textAlign: 'center', fontSize: '14px' }
        }],
        printerName: finalPrinter,
        config: config
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


// Convert image URL to Base64 (if needed)
async function imageToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export const generateReceiptHTML = async (params) => {
    const { type, storeInfo, items, tableNo, kotNo, sale, qrData } = params;
    const config = getStoredConfig();
    const logoUrl = params.logoUrl || (config?.logoBase64 ? `data:image/png;base64,${config.logoBase64}` : null);
    const storeName = storeInfo?.storeName || 'Store';
    const address = storeInfo?.address || '';
    const gst = storeInfo?.gstin || '';

    // ---------- Compute totals and GST ----------
    let subtotal = 0;
    let cgst = 0, sgst = 0, halfGstRate = 0, netAmount = 0;

    // If sale object is provided (for type 'sale'), use its values
    if (type === 'sale' && sale) {
        subtotal = parseFloat(sale.totalAmount) || 0;
        cgst = parseFloat(sale.cgst) || 0;
        sgst = parseFloat(sale.sgst) || 0;
        halfGstRate = parseFloat(sale.halfGstRate) || 0;
        netAmount = parseFloat(sale.netAmount) || subtotal + cgst + sgst;
    } else {
        // For summary or kot, compute from items
        subtotal = items?.reduce((sum, item) => sum + (item.price * (item.quantity ?? 0)), 0) || 0;
        netAmount = subtotal;
        // If we have a halfGstRate in params, we could compute – but not needed for non-sale
    }

    // Build item rows
    const isKOT = type === 'kot';
    let itemRows = '';
    (items || []).forEach(item => {
        const qty = item.quantity ?? 0;
        const price = item.price ?? 0;
        const subtotalItem = qty * price;
        itemRows += isKOT
            ? `<tr><td>${item.name}</td><td style="text-align:center">${qty}</td></tr>`
            : `<tr>
                <td>${item.name}</td>
                <td style="text-align:center">${qty}</td>
                <td style="text-align:right">₹${price.toFixed(2)}</td>
                <td style="text-align:right">₹${subtotalItem.toFixed(2)}</td>
              </tr>`;
    });

    // Generate QR code
    let qrImage = '';
    if (qrData) {
        try {
            qrImage = await QRCode.toDataURL(qrData, { width: 120, margin: 2 });
        } catch (e) { console.warn('QR generation failed', e); }
    }

    // Logo image
    let logoImage = '';
    if (logoUrl) {
        try {
            if (logoUrl.startsWith('data:image')) {
                logoImage = logoUrl;
            } else {
                logoImage = await imageToBase64(logoUrl);
            }
        } catch (e) { console.warn('Logo load failed', e); }
    }

    // Build HTML
    const bodyFontFamily = config?.fontFamily ? `'${config.fontFamily}', monospace` : "'Courier New', monospace";
    const bodyFontSize = config?.fontSize ? `${config.fontSize}px` : '12px';
    const bodyFontWeight = config?.bold ? 'bold' : 'normal';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Receipt</title>
            <style>
                @page { size: 58mm auto; margin: 0; }
                body {
                    font-family: ${bodyFontFamily};
                    font-weight: ${bodyFontWeight};
                    width: 58mm;
                    padding: 6px 4px;
                    margin: 0;
                    font-size: ${bodyFontSize};
                    box-sizing: border-box;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: optimizeLegibility;
                }
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
                .receipt { text-align: center; }
                .logo img { max-width: 80%; height: auto; margin-bottom: 4px; }
                .store-name { font-size: 16px; font-weight: bold; }
                .address, .gst { font-size: 11px; }
                .hr { border-top: 1px dashed #000; margin: 4px 0; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; }
                th, td { padding: 2px 0; }
                th { border-bottom: 1px solid #000; text-align: left; }
                .amount-row td { padding-top: 4px; font-weight: bold; }
                .qr-code img { width: 80px; height: 80px; margin-top: 6px; }
                .footer { margin-top: 8px; font-size: 11px; }
                .gst-row td { padding-top: 2px; }
            </style>
        </head>
        <body>
            <div class="receipt">
                ${logoImage ? `<div class="logo"><img src="${logoImage}" alt="Logo" /></div>` : ''}
                <div class="store-name">${storeName}</div>
                <div class="address">${address}</div>
                <div class="gst">GST: ${gst}</div>
                <div class="hr"></div>
                ${type === 'kot' ? `<div><strong>KITCHEN ORDER</strong></div>` : ''}
                ${type === 'summary' ? `<div><strong>ORDER SUMMARY</strong></div>` : ''}
                ${type === 'sale' ? `<div><strong>BILL</strong></div>` : ''}
                ${type === 'sale' ? `<div>Bill#: ${sale?.billNo || ''}</div>` : ''}
                ${type !== 'sale' ? `<div>Table: ${tableNo || '--'}</div>` : ''}
                ${kotNo ? `<div>KOT#: ${kotNo}</div>` : ''}
                <div>Date: ${new Date().toLocaleString()}</div>
                <div class="hr"></div>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style="text-align:center">Qty</th>
                            ${isKOT ? '' : `<th style="text-align:right">Rate</th>
                            <th style="text-align:right">Total</th>`}
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                        ${isKOT ? '' : `<tr class="amount-row">
                            <td colspan="3" style="text-align:right"><strong>Subtotal:</strong></td>
                            <td style="text-align:right"><strong>₹${subtotal.toFixed(2)}</strong></td>
                        </tr>`}
                    </tbody>
                </table>
                ${!isKOT && type === 'sale' ? `
                    <div class="hr"></div>
                    <div style="text-align:right; font-size:11px; line-height:1.6;">
                        <div>CGST (${halfGstRate.toFixed(2)}%): ₹${cgst.toFixed(2)}</div>
                        <div>SGST (${halfGstRate.toFixed(2)}%): ₹${sgst.toFixed(2)}</div>
                        <div style="font-weight:bold; font-size:13px; margin-top:4px;">
                            Net Amount: ₹${netAmount.toFixed(2)}
                        </div>
                    </div>
                ` : ''}
                ${!isKOT && type !== 'sale' ? `
                    <div class="hr"></div>
                    <div style="text-align:right; font-size:12px; font-weight:bold; margin-top:4px;">
                        Total: ₹${netAmount.toFixed(2)}
                    </div>
                ` : ''}
                <div class="hr"></div>
                ${isKOT ? `
                    <div style="font-weight:bold;">=== FOR KITCHEN ===</div>
                    <div>Please prepare</div>
                ` : `
                    <div class="footer">Thank you! Visit again!</div>
                    ${qrImage ? `<div class="qr-code"><img src="${qrImage}" alt="QR Code" /></div>` : ''}
                `}
            </div>
        </body>
        </html>
    `;
};

export { getStoredPrinter, setStoredPrinter, getStoredConfig, setStoredConfig, getStoredPrintMethod };

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
    setStoredConfig,
    getStoredPrintMethod,
    generateReceiptText,
    printViaBrowser,
    generateReceiptHTML
};