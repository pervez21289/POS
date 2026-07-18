# Mobile usability pass

Files changed: `SalesPOSPage.jsx`, `POSHeader.jsx`, `ActiveTablesSection.jsx`, `ProductSearchBar.jsx`, `CartPanel.jsx`.
Unchanged: `ProductPanel.jsx`, `ProductCard.jsx`, `KOTManager.jsx` (already fine on mobile).

## The biggest problem: the cart table
`CartPanel` rendered a 6-column MUI `<Table>` (Barcode / Item / Qty / Rate / Total / Action) even inside
the mobile drawer. On a ~375px screen that's unreadable and the qty stepper is nearly untappable.
`CartPanel` now takes an `isMobile` prop: on mobile it renders each item as a stacked card (name, big
+/- steppers, remove button) instead of table columns; desktop keeps the original table untouched.

## Header was overflowing
`POSHeader` had 6 buttons + an icon in a `flexWrap` row — on a phone that wraps into 2-3 messy rows
of tiny buttons. It now branches on `isMobile`:
- Visible: table chip, **New** order, cart icon (badge), and a **⋮ more** menu.
- One tap away in the menu: Save KOT, View KOTs, Print KOT, Test Printer, Printer Settings.

## Active tables ate vertical space
`ActiveTablesSection` now defaults to **collapsed on mobile** (still one tap to expand), and when
expanded it's a horizontally-scrolling strip on mobile instead of a wrapping 2-column grid, so it
doesn't push the product grid off-screen.

## Search row was 3 stacked full-width fields
`ProductSearchBar` now puts the product search on its own row, and groups barcode input + refresh
into one row underneath, instead of three separate full-width rows on mobile.

## Checkout is now always one tap away
`SalesPOSPage` adds a sticky bottom bar (mobile only, shown once the cart has items) with item count
and total — tapping it opens the cart drawer. This is the standard "View Cart" pattern and is far
easier to find than a badge tucked into a crowded header. The payment dialog is now `fullScreen` on
mobile too, since a small centered dialog is awkward to fill in on a phone keyboard.

## Touch targets
Icon buttons involved in frequent taps (qty steppers, refresh, cart, overflow menu) are sized to at
least 36–44px, in line with typical mobile tap-target guidance.

## Things I did not change
- `ProductCard` / `ProductGrid` sizing — the existing `minmax(140px, 1fr)` grid already gives ~2
  comfortably-sized columns on a typical phone width.
- `KOTManager` dialog — already full-width with reasonably-sized icon buttons.

If you want, I can also add camera-based barcode scanning (vs. the current scanner-peripheral text
field) or a simplified single-column "focus mode" for very small/older devices — let me know if either
is relevant to how this gets used in the field.
