/**
 * Universal receipt printer.
 * Single API: printReceipt({ type, items, storeInfo, ... })
 */

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

    const storeName = storeInfo?.storeName || 'Store Name';
    const address = storeInfo?.address || 'Store Address';
    const gst = storeInfo?.gstin || '-';

    // Header
    lines.push(center(safeText(storeName)));
    lines.push(center(safeText(address)));
    lines.push(center(`GST: ${safeText(gst)}`));
    lines.push('-'.repeat(LINE_WIDTH));

    // Type‑specific details
    if (type === 'summary') {
        const { tableNo, subtotal } = params;
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
        lines.push(`Mobile: ${sale.mobileNumber || ''}`);
        lines.push('-'.repeat(LINE_WIDTH));
    }

    // Items
    lines.push('Item       Qty   Rt     Tot');
    (items || []).forEach(item => {
        lines.push(safeText(item.name));
        const qty = padLeft(item.quantity?.toString() || '0', 2);
        const rate = padLeft(item.price?.toFixed(0) || '0', 4);
        const total = padLeft((item.quantity * item.price).toFixed(0), 7);
        const barcode = padRight(item.barcode || '-', 10);
        lines.push(`${barcode} ${qty} ${rate} ${total}`);
    });

    lines.push('-'.repeat(LINE_WIDTH));

    // Totals
    let subtotal = 0, cgst = 0, sgst = 0, halfGstRate = 0, netAmount = 0;
    if (type === 'summary' || type === 'kot') {
        subtotal = params.subtotal || 0;
        netAmount = subtotal;
    } else {
        const sale = params.sale;
        subtotal = sale.totalAmount || 0;
        cgst = sale.cgst || 0;
        sgst = sale.sgst || 0;
        halfGstRate = sale.halfGstRate || 0;
        netAmount = sale.netAmount || sale.totalAmount || 0;
    }

    lines.push(`${padRight('Subtotal:', 16)}${padLeft(subtotal.toFixed(2), 14)}`);
    if (type === 'sale' && (cgst > 0 || sgst > 0)) {
        lines.push(`${padRight(`CGST (${halfGstRate.toFixed(2)}%):`, 16)}${padLeft(cgst.toFixed(2), 14)}`);
        lines.push(`${padRight(`SGST (${halfGstRate.toFixed(2)}%):`, 16)}${padLeft(sgst.toFixed(2), 14)}`);
    }
    const itemCount = (items || []).length;
    lines.push(`${padRight('Items:', 16)}${padLeft(itemCount.toString(), 14)}`);
    lines.push('-'.repeat(LINE_WIDTH));
    
    // Footer based on type
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

// ---------- Low-level print function ----------
const printText = (text, title = 'Receipt', useIframe = false) => {
    // React Native WebView
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(text);
        return;
    }

    // Iframe mode: no new window, just a hidden iframe
    if (useIframe) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        const iframeDoc = iframe.contentWindow?.document;
        if (iframeDoc) {
            iframeDoc.write(`
                <html>
                    <head>
                        <title>${title}</title>
                        <style>
                            @media print { @page { margin: 0; } body { margin: 0; font-family: monospace; font-size: 12px; } }
                            body { font-family: monospace; white-space: pre; font-size: 12px; }
                        </style>
                    </head>
                    <body onload="window.print();">
                        <pre>${text}</pre>
                    </body>
                </html>
            `);
            iframeDoc.close();
            setTimeout(() => document.body.removeChild(iframe), 3000);
        }
        return;
    }

    // Default: open a new window
    try {
        const printWindow = window.open('', '_blank', 'width=320,height=600');
        if (!printWindow) {
            // fallback to iframe if popup is blocked
            printText(text, title, true);
            return;
        }
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        @media print { @page { margin: 0; } body { margin: 0; font-family: monospace; font-size: 12px; } }
                        body { font-family: monospace; white-space: pre; font-size: 12px; }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <pre>${text}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
    } catch (error) {
        console.error('Print error:', error);
        alert('Unable to print. Please check your browser settings.');
    }
};

// ---------- Public API ----------
/**
 * Print a receipt (KOT, order summary or final sale receipt).
 *
 * @param {Object} params
 * @param {string} params.type - 'kot', 'summary' or 'sale'
 * @param {Array}  params.items - Array of items { name, barcode, quantity, price }
 * @param {Object} params.storeInfo - { storeName, address, gstin }
 * @param {string|number} [params.tableNo] - Required for 'summary' and 'kot'
 * @param {string|number} [params.kotNo] - Required for 'kot'
 * @param {number} [params.subtotal] - Required for 'summary' and 'kot'
 * @param {Object} [params.sale] - Required for 'sale' (billNo, saleTime, userName, customerName, mobileNumber, totalAmount, cgst, sgst, netAmount, halfGstRate)
 * @param {string} [params.title] - Window title (defaults to 'KOT', 'Order Summary' or 'Receipt')
 * @param {boolean} [params.useIframe] - If true, prints from a hidden iframe (no popup). Default false.
 */
export const printReceipt = (params) => {
    const { type, title, useIframe = false } = params;
    const defaultTitle = type === 'kot' ? 'KOT' : type === 'summary' ? 'Order Summary' : 'Receipt';
    const finalTitle = title || defaultTitle;

    const text = generateReceiptText(params);
    printText(text, finalTitle, useIframe);
};