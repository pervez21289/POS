import React from 'react';
import { useGetBasicSettingsQuery } from './../../services/basicSettingAPI';

const SalesReceipt = React.forwardRef(({ receiptInfo, saleId, mobileNumber, customerName }, ref) => {
    const { data, isLoading } = useGetBasicSettingsQuery();
    const fontSize = '11px';
    const totalItems = receiptInfo?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    if (isLoading) return <p>Loading...</p>;

    return (
        <div ref={ref} style={{ fontFamily: 'Courier New, monospace', padding: 0, margin: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 'bolder', textAlign: 'center', margin: 0 }}>{data?.[0].storeName}</p>
            <p style={{ fontSize, textAlign: 'center', margin: 0, fontWeight: 'bold' }}>{data?.[0].address}</p>
            <p style={{ fontSize, textAlign: 'center', margin: 0, fontWeight: 'bold' }}>GST: {data?.[0].gstin}</p>
            <hr style={{ margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ fontSize, fontWeight: 'bold' }}>Bill#: {saleId}</p>
                    <p style={{ fontSize, fontWeight: 'bold' }}>Date: {receiptInfo?.saleTime}</p>
                    <p style={{ fontSize, fontWeight: 'bold' }}>Cashier: {receiptInfo?.userName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize, fontWeight: 'bold' }}>Name: {customerName}</p>
                    <p style={{ fontSize, fontWeight: 'bold' }}>Mobile: {mobileNumber}</p>
                </div>
            </div>

            <hr style={{ margin: '4px 0' }} />

            <table style={{ width: '100%', fontSize, borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ fontSize, textAlign: 'left' }}>Barcode</th>
                        <th style={{ fontSize, textAlign: 'center' }}>Qty</th>
                        <th style={{ fontSize, textAlign: 'right' }}>Rate</th>
                        <th style={{ fontSize, textAlign: 'right' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {receiptInfo?.cart?.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan="4" style={{ fontWeight: 'bold', fontSize, borderBottom: 'none', paddingTop: '4px' }}>
                                    {item.name}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontSize, fontWeight: 'bold' }}>{item.barcode || '-'}</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>{item.price.toFixed(2)}</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>
                                    {(item.quantity * (item?.price - (item.discount || 0))).toFixed(2)}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <hr style={{ margin: '10px 0' }} />

            <table style={{ width: '100%', fontSize }}>
                <tbody>
                    <tr>
                        <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Subtotal</td>
                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>₹{receiptInfo?.totalAmount?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Discount</td>
                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>₹{receiptInfo?.discountAmount?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Tax</td>
                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>₹{receiptInfo?.taxAmount?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ fontWeight: 'bold', fontSize }}>Total Payable</td>
                        <td style={{ fontWeight: 'bold', fontSize, textAlign: 'right' }}>₹{receiptInfo?.net?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Items</td>
                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>{totalItems}</td>
                    </tr>
                </tbody>
            </table>

            <hr style={{ margin: '4px 0' }} />
            <p style={{ fontSize, fontWeight: 'bold', textAlign: 'center', marginTop: '8px' }}>Thank you! Visit again.</p>
        </div>
    );
});

export default SalesReceipt;
