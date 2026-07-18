# SalesPOSPage refactor

The original 930-line file is split into a page + 6 presentational components + 4 hooks.

```
SalesPOSPage.jsx              orchestrator: local UI state + wiring only
components/
  POSHeader.jsx                gradient top bar (table chip, KOT/order/print buttons)
  ActiveTablesSection.jsx      saved-KOTs grid with show/hide toggle
  TableCard.jsx                single table/KOT card (was defined inline before)
  ProductPanel.jsx             left-hand panel wrapper (search bar + grid)
  ProductSearchBar.jsx         autocomplete search + barcode input + refresh
  ProductGrid.jsx              product card grid + empty state
hooks/
  useInitialPOSData.js         plan check, product load/sync, default table, printer check, barcode focus
  useCartActions.js            addToCart / updateQuantity / removeFromCart / submitBarcode
  useKOTActions.js             save / load / delete draft cart, new order
  usePrintActions.js           print KOT (table or current order), print receipt, test printer
```

## What changed vs. the original
- `TableCard` no longer takes an unused `storeInfo` prop (it never used it).
- Barcode-submit logic (`useCartActions.submitBarcode`) now returns `true`/`false` instead of
  clearing `barcodeValue` itself, since that state lives in the page — the page clears it on `true`.
- Everything else is a straight extraction: same MUI markup, same Redux actions, same behavior.

## Path note
Imports (e.g. `../../store/reducers/sales`) assume `SalesPOSPage.jsx` stays exactly where it was.
Since `components/` and `hooks/` sit one folder deeper, their relative imports have one extra `../`
(e.g. `../../../store/reducers/sales`). If your actual project structure differs, adjust those paths
after copying the files in.
