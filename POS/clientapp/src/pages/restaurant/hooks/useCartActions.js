import { useDispatch } from 'react-redux';
import { setReceiptInfo } from '../../../store/reducers/sales';
import { showAlert } from '../../../store/reducers/alert';

// All cart-mutating operations: add product, change quantity, remove item,
// and resolving a scanned/typed barcode to a product add.
export default function useCartActions({ receiptInfo, products }) {
    const dispatch = useDispatch();

    const addToCart = (product) => {
        const currentCart = receiptInfo?.saleItems || [];
        const existing = currentCart.find(i => i.productID === product.productID);
        let updatedCart;
        if (existing) {
            updatedCart = currentCart.map(i =>
                i.productID === product.productID ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            updatedCart = [...currentCart, { ...product, quantity: 1, discount: 0, tax: 0 }];
        }
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: updatedCart } }));
    };

    const updateQuantity = (productID, qty) => {
        const currentCart = receiptInfo?.saleItems || [];
        const updated = currentCart.map(i =>
            i.productID === productID ? { ...i, quantity: Math.max(1, Number(qty)) } : i
        );
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: updated } }));
    };

    const removeFromCart = (productID) => {
        const currentCart = receiptInfo?.saleItems || [];
        const filtered = currentCart.filter(i => i.productID !== productID);
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: filtered } }));
    };

    const submitBarcode = (barcodeValue) => {
        const scanned = barcodeValue.trim();
        if (!scanned) return false;
        const product = products.find(p => p.barcode === scanned);
        if (product) {
            addToCart(product);
            return true;
        }
        dispatch(showAlert({ open: true, message: 'Product not found', severity: 'warning' }));
        return false;
    };

    return { addToCart, updateQuantity, removeFromCart, submitBarcode };
}
