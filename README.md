# Trailhead — Alpine Ascent Pack

A production-quality product detail page for a premium outdoor gear store built as a frontend engineering assignment.

**Stack:** React 18 · TypeScript · Vite · SCSS Modules

---

## Setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

- Dev server → `http://localhost:5173`
- Production build → `npm run build`
- Preview production build → `npm run preview` → `http://localhost:4173`

---

## Features Built

### Image Gallery

- Large primary image with arch mask
- Thumbnail row — click to swap main image, active state visible
- Desktop: hover zoom with cursor-tracked transform-origin
- Mobile: horizontal scroll with dot position indicator synced to scroll

### Product Info Panel

- Product name, brand, and price
- Sale price with original crossed out and discount badge
- Colour swatches — per-colour stock model (switching colour updates size availability)
- Size buttons — available / low stock ("Only N left") / sold out (greyed, unselectable)
- Quantity picker capped at remaining stock for selected variant
- Add to Cart — full width, disabled on sold out, shows "Max Added" at stock limit
- Delivery estimate strip
- Mobile: sticky Add to Cart bar fixed at bottom of viewport

### Cart

- Slide-in drawer from right (desktop), sheet from bottom (mobile)
- Cart badge in navbar shows live item count
- Item quantity controls with per-variant stock cap enforcement
- Order summary: subtotal, shipping (free over $250), total
- Persists in localStorage — survives page refresh
- Escape key and overlay dismiss

### State & URL

- Selected colour and size reflected in URL (`?colour=slate-blue&size=20l`)
- URL params rehydrated on page load — page is deep-linkable
- Cart state backed by localStorage with lazy initialiser (no flash of empty cart)

### Below-Fold Details (lazy loaded)

- **Description** — headline, body, feature bullets with check icons, outdoor image
- **Specifications** — 8-cell responsive grid
- **Reviews** — rating score, performance bars, 3 verified review cards

### Precision Engineering Section

- Desktop: bento grid with two image cards and three feature cards
- Mobile: four stacked feature cards

### Layout

- Desktop: two-column layout, gallery 55% / info 45%
- Mobile: single column, all content stacked
- Responsive breakpoint at 767px

### Navbar & Footer

- Navbar with cart icon badge and live item count
- Footer: 4-column desktop grid (brand, SHOP, SUPPORT, NEWSLETTER) / 2-column mobile link grid

---

## Design Decisions

See [DECISIONS.md](./DECISIONS.md) for the full narrative — all five open questions from the assignment brief are documented there along with key architectural decisions.

---

## Known Trade-offs

- **Static variant and content data** — `variantConfig.ts` and `productDetails.ts` are local configs. In production these would come from a variant API and a CMS respectively.
- **No focus trap in cart drawer** — focus moves to the drawer on open but is not trapped. A complete implementation would prevent tabbing outside the dialog while open.
- **Checkout non-functional** — out of scope for this assignment.
- **Newsletter non-functional** — form clears on submit but has no API call or success state.
- **Navbar links are static** — no routing implemented. Assignment scope is a single PDP.
- **No error boundary** — API failures render an inline error message rather than a proper error boundary component.

---

## Project Structure

```
src/
├── components/
│   ├── cart/          # CartDrawer
│   ├── details/       # ProductTabs, DescriptionPanel, SpecificationsPanel, ReviewsPanel, PrecisionEngineering
│   ├── gallery/       # ImageGallery, PrimaryImage, ThumbnailStrip
│   ├── layout/        # Navbar, Footer
│   └── product/       # ProductInfo, PriceDisplay, ColourSwatch, SizeSelector, QuantityPicker, AddToCartButton, DeliveryEstimate
├── constants/         # api, product, storage, layout, cart constants
├── data/              # variantConfig, productDetails, precisionEngineering
├── hooks/             # useProduct, useImageGallery, useVariant, useCart
├── services/          # product.service, cart.service
├── stores/            # CartContext
├── styles/            # _tokens, _breakpoints, _reset, _typography, main
├── types/             # product, cart, api types
└── utils/             # url, stock, price, product utils
```

---
