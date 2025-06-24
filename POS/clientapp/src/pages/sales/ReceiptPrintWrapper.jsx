import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesReceipt from './SalesReceipt'; // Your receipt component

const ReceiptPrintWrapper = (receiptInfo) => {
    const printRef = useRef();
    const navigate = useNavigate();

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        // No reload here
    };

    const handleGoBack = () => {
        navigate('/sales'); // Replace '/sales' with your actual POS route
    };

    return (
        <>
            <div ref={printRef}>
                <SalesReceipt {...receiptInfo} />
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <button onClick={handlePrint}>🖨 Print Receipt</button>
                <button onClick={handleGoBack}>⬅ Go Back to Sale Page</button>
            </div>
        </>
    );
};

export default ReceiptPrintWrapper;
