import React, { useRef, useEffect } from 'react';
import SalesReceipt from './SalesReceipt'; // Your receipt component

const ReceiptPrintWrapper = (receiptInfo) => {
    const printRef = useRef();

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Optional: reload to restore state
    };


    useEffect(() => {
        debugger;
        var data = receiptInfo;

    }, [receiptInfo]);

    return (
        <>
            <div ref={printRef}>
                <SalesReceipt {...receiptInfo} />
            </div>
            <button onClick={handlePrint}>🖨 Print Receipt</button>
        </>
    );
};

export default ReceiptPrintWrapper;