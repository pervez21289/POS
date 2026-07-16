// src/pages/SalesPOS/useSalesPOS.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setReceiptInfo, saveDraftCart, loadDraftCart, deleteDraftCart, updateDraftCart } from '../../store/reducers/sales';
import { setPlan } from '../../store/reducers/users';
import { showAlert } from '../../store/reducers/alert';
import { showConfirmDialog } from '../../store/reducers/confirm';
import { setDrawerComponent } from '../../store/reducers/drawer';
import PaymentService from '../../services/PaymentService';
import { manualProductSync, getProductsSync } from '../../hooks/useProductSync';
import ReceiptPrintWrapper from '../../components/ReceiptPrintWrapper';

export const useSalesPOS = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { receiptInfo, draftCarts } = useSelector((state) => state.sales);

  // Local state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // ---------- Load products & plan ----------
  useEffect(() => {
    const init = async () => {
      try {
        const plan = await PaymentService.GetCurrentActivePlan();
        dispatch(setPlan(plan));
        if (plan?.planStatus !== 'Active') {
          navigate('/subscriptionplan');
          return;
        }

        // Load products (online sync if possible)
        if (navigator.onLine) {
          await manualProductSync();
        }
        const productList = await getProductsSync();
        setProducts(productList || []);
      } catch (err) {
        navigate('/subscriptionplan');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [dispatch, navigate]);

  // ---------- Table / KOT management ----------
  // Initialize table number from existing drafts or fallback to 1
  useEffect(() => {
    if (draftCarts.length > 0) {
      const maxTable = Math.max(...draftCarts.map((d) => d.tableNo), 0);
      setSelectedTable(maxTable + 1);
    } else {
      setSelectedTable(1);
    }
  }, [draftCarts]);

  const handleSaveKOT = useCallback(() => {
    if (!receiptInfo?.saleItems?.length) {
      dispatch(showAlert({ open: true, message: 'Cart is empty!', severity: 'warning' }));
      return;
    }
    const existing = draftCarts.find((d) => d.tableNo === selectedTable);
    if (existing) {
      dispatch(updateDraftCart({ tableNo: selectedTable, saleItems: receiptInfo.saleItems }));
    } else {
      dispatch(saveDraftCart(selectedTable));
    }
    dispatch(showAlert({ open: true, message: `KOT saved for Table ${selectedTable}`, severity: 'success' }));
  }, [dispatch, receiptInfo, draftCarts, selectedTable]);

  const handleLoadKOT = useCallback(
    (tableNo) => {
      const hasItems = receiptInfo?.saleItems?.length > 0;
      const doLoad = () => {
        dispatch(loadDraftCart(tableNo));
        setSelectedTable(tableNo);
      };
      if (hasItems) {
        dispatch(
          showConfirmDialog({
            title: 'Replace Cart?',
            message: 'Your current cart will be replaced. Continue?',
            confirmText: 'Yes, Replace',
            cancelText: 'Cancel',
            confirmColor: 'warning',
            onConfirm: doLoad,
          })
        );
      } else {
        doLoad();
      }
    },
    [dispatch, receiptInfo]
  );

  const handleDeleteKOT = useCallback(
    (tableNo) => {
      dispatch(deleteDraftCart(tableNo));
    },
    [dispatch]
  );

  const handleNewOrder = useCallback(() => {
    dispatch(setReceiptInfo({ receiptInfo: { saleItems: [] } }));
    const newTable = draftCarts.length ? Math.max(...draftCarts.map((d) => d.tableNo), 0) + 1 : 1;
    setSelectedTable(newTable);
  }, [dispatch, draftCarts]);

  // ---------- Cart operations ----------
  const addToCart = useCallback(
    (product) => {
      const currentCart = receiptInfo?.saleItems || [];
      const existing = currentCart.find((i) => i.productID === product.productID);
      let updatedCart;
      if (existing) {
        updatedCart = currentCart.map((i) =>
          i.productID === product.productID ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedCart = [...currentCart, { ...product, quantity: 1, discount: 0, tax: 0 }];
      }
      dispatch(setReceiptInfo({ receiptInfo: { saleItems: updatedCart } }));
    },
    [dispatch, receiptInfo]
  );

  const updateQuantity = useCallback(
    (productID, qty) => {
      const currentCart = receiptInfo?.saleItems || [];
      const updatedCart = currentCart.map((i) =>
        i.productID === productID ? { ...i, quantity: Math.max(1, Number(qty)) } : i
      );
      dispatch(setReceiptInfo({ receiptInfo: { saleItems: updatedCart } }));
    },
    [dispatch, receiptInfo]
  );

  const removeFromCart = useCallback(
    (productID) => {
      const currentCart = receiptInfo?.saleItems || [];
      const updatedCart = currentCart.filter((i) => i.productID !== productID);
      dispatch(setReceiptInfo({ receiptInfo: { saleItems: updatedCart } }));
    },
    [dispatch, receiptInfo]
  );

  // ---------- Barcode handling ----------
  const handleBarcodeSubmit = useCallback(() => {
    const scanned = barcodeValue.trim();
    if (!scanned) return;
    const product = products.find((p) => p.barcode === scanned);
    if (product) {
      addToCart(product);
      setBarcodeValue('');
    } else {
      dispatch(showAlert({ open: true, message: 'Product not found', severity: 'warning' }));
    }
  }, [barcodeValue, products, addToCart, dispatch]);

  // ---------- Checkout ----------
  const handleCheckout = useCallback(() => {
    dispatch(
      setDrawerComponent({
        DrawerComponentChild: ReceiptPrintWrapper,
        drawerOpen: true,
      })
    );
  }, [dispatch]);

  // ---------- Product filtering ----------
  const filteredProducts = useMemo(() => {
    if (!searchInput) return products;
    const lower = searchInput.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.barcode?.includes(searchInput)
    );
  }, [products, searchInput]);

  // ---------- Refresh products (manual sync) ----------
  const refreshProducts = useCallback(async () => {
    if (navigator.onLine) {
      await manualProductSync();
      const updated = await getProductsSync();
      setProducts(updated || []);
      dispatch(showAlert({ open: true, message: 'Products refreshed!', severity: 'success' }));
    } else {
      dispatch(showAlert({ open: true, message: 'Offline – using cached products', severity: 'info' }));
    }
  }, [dispatch]);

  // Return everything the UI needs
  return {
    // State
    products,
    loading,
    selectedTable,
    barcodeValue,
    setBarcodeValue,
    searchInput,
    setSearchInput,
    filteredProducts,
    cartItems: receiptInfo?.saleItems || [],
    totalAmount: receiptInfo?.totalAmount || 0,
    totalItems: receiptInfo?.totalItems || 0,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    handleBarcodeSubmit,
    handleSaveKOT,
    handleLoadKOT,
    handleDeleteKOT,
    handleNewOrder,
    handleCheckout,
    refreshProducts,
  };
};