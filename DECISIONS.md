# DECISIONS.md

This document covers the five open questions from the assignment brief, plus key
architectural decisions made during implementation. Written honestly — these reflect
actual choices made in the code, not post-hoc justifications.

---

## Decision #1 — Tabs vs Accordion

**Chose: Tabs**

Product detail pages are scanned, not read linearly. A user arriving at a PDP has
already decided they're interested — they want to quickly cross-reference specs
against the description, then check reviews. Tabs support this scanning behaviour
better than an accordion because all three panel labels are visible simultaneously,
making it clear what information is available without any interaction.

Accordions work better when the user needs to read sections in sequence, or when
the number of panels is large and unpredictable. Three fixed panels (Description,
Specifications, Reviews) with no natural ordering dependency is a tabs use case.

The trade-off I rejected: accordions are more mobile-friendly by default because
they don't require a tab bar that can overflow horizontally. I mitigated this by
making the tab bar horizontally scrollable on mobile, which keeps the tab pattern
consistent across viewports without breaking on small screens.

---

## Decision #2 — Image Zoom Strategy

**Chose: CSS transform scale on mousemove with dynamic transform-origin**

Three options were considered:

- **CSS transform scale** — scale the image to 2x on hover, with transform-origin
  tracking the cursor position so the magnified area follows the mouse. No extra DOM,
  no library, zero Lighthouse impact.
- **Lens overlay** — a separate magnified inset div that follows the cursor. More
  accurate to ecommerce convention but requires significant DOM and JS overhead.
- **Lightbox** — click to open full size in a modal. Different interaction model,
  better for mobile, but the spec specifically mentioned hover zoom.

I chose the CSS transform approach because it satisfies the spec requirement with
the least implementation complexity and no Lighthouse cost. The dynamic
transform-origin gives the same "follow the cursor" feel as a lens without the
additional DOM node. The trade-off is that the image crops at the edges during zoom
rather than showing a separate magnified panel — acceptable for this scope.

Zoom is disabled on mobile (touch devices don't have hover) and the image is
navigable via thumbnail swap and dot indicator instead.

---

## Decision #3 — Context API vs Alternatives

**Chose: Context API (React built-in)**

The scope of this application is one page with one global concern: the cart. There
is no cross-route state, no complex derived state, no need for middleware, and no
performance-critical update frequency.

Zustand and Jotai are both excellent for larger applications where Context causes
re-render cascades across many components, or where you need fine-grained
subscriptions. Neither problem exists here. Adding Zustand to solve a problem that
Context handles cleanly would add a dependency without a corresponding benefit.

Redux was not considered — it is architecturally appropriate for applications with
complex state interactions across many features, which this is not.

The one legitimate concern with Context is re-render performance: every consumer
re-renders when context value changes. I mitigated this by keeping CartContext
lean — it holds only cart items and the three action functions. Components that
don't need the cart don't consume it.

---

## Decision #4 — Variant Modeling Strategy

**Chose: Local variant configuration layer merged at the service boundary**

This is the most architecturally significant decision in the project, and it
requires honest documentation.

The Fake Store API returns only: `id`, `title`, `price`, `description`,
`category`, `image`, and `rating`. It provides no colours, no sizes, no stock
levels, no variants of any kind.

The assignment requires all four. The options were:

- **Use a completely different API** — several APIs with variant support exist but
  none are as universally known or as simple to use as Fake Store. Using an
  obscure API would make the fetch layer harder to evaluate.
- **Mock the entire product locally** — skip the API entirely and use hardcoded
  data. This satisfies the UI requirements but removes the API integration
  demonstration the assignment is clearly testing.
- **Fetch from the API, enrich locally** — use the real API for the fields it
  provides (`id`, `price`, `rating`), and merge in a local `variantConfig.ts` for
  everything visual and variant-specific.

I chose the third approach. The fetch to `fakestoreapi.com` is real and happens at
runtime. The `price` and `rating` values in the UI come directly from the API
response. The `enrichProduct` function in `product.service.ts` merges the raw API
shape with the local config at the service boundary, producing an `EnrichedProduct`
that the rest of the application uses exclusively.

The `FakeStoreProduct` type (raw API shape) is never imported outside
`services/product.service.ts`. This boundary is enforced by convention and visible
in the import graph.

The trade-off: the variant data is static, not dynamic. In a real application,
colours, sizes, and stock would come from a product API that actually supports
variants. This is documented here rather than hidden.

---

## Decision #5 — Mobile Gallery Dot Indicator

**Chose: onScroll listener with scrollLeft calculation**

Three options for tracking thumbnail scroll position:

- **IntersectionObserver** — accurate, performant, but more setup for a fixed
  small set of thumbnails where the container width is known.
- **Manual index tracking via onScroll** — calculate the active index from
  `scrollLeft / itemWidth` on every scroll event. Simple, readable, works
  correctly with CSS scroll-snap.
- **CSS-only** — not viable for syncing a separate dot indicator element.

I chose the `onScroll` approach. With CSS `scroll-snap-type: x mandatory` handling
the snapping, the scroll position after snap is always a clean multiple of item
width, making the index calculation reliable. The implementation is straightforward
enough that it doesn't warrant the IntersectionObserver setup overhead.

Two-way sync is implemented: tapping a dot scrolls the strip to the correct
thumbnail using `scrollTo` with `behavior: smooth`, and scrolling the strip
updates the active dot in real time.

---

## Architectural Decision — Why SCSS Modules over Tailwind

The assignment explicitly requires Sass or SCSS modules and forbids Tailwind. But
worth documenting why this is the right call for this type of project regardless:

The Stitch design system has a precise Material Design-derived colour token set
(40+ named colours), a specific spacing scale, and typography roles. Tailwind's
utility classes map poorly to named semantic tokens — you would end up with
`bg-[#8b4a32]` instead of `background-color: $color-primary`, which defeats the
purpose of a design system. SCSS modules with a `_tokens.scss` source of truth
give the design system first-class representation in the codebase.

---

## What I Would Do Differently With More Time

**1. Real variant API**
The local `variantConfig.ts` enrichment layer works but is static. With more time
I would set up a simple Express mock server that returns variant data dynamically,
making the architecture honest end-to-end rather than partially hardcoded.

**2. URL sync before cart persistence**
I built cart state co-location in `ProductInfo` before implementing URL-based
variant sync. This means the selected variant is lost on refresh. The correct
build order would have been URL sync first, then cart persistence, so both features
were testable together. This is a sequencing mistake.

**3. Quantity state in URL**
Currently quantity resets on refresh. A better implementation would persist
quantity in the URL alongside colour and size: `?colour=slate-blue&size=20l&qty=2`.
This would make the page fully deep-linkable including quantity.

**4. Image optimisation**
The Unsplash images are loaded at full resolution. With more time I would use
Unsplash's width parameter more aggressively (`?w=400` for thumbnails, `?w=800`
for the primary image) and add `loading="lazy"` to below-fold images. The primary
image should use `fetchpriority="high"` to improve LCP.

**5. Error boundary**
The current error state in `useProduct` renders an inline error message. A proper
implementation would use a React error boundary component so API failures don't
break the entire page render.

## Decision #6 — Cart State Architecture

**Chose: React Context API with localStorage lazy initialiser**

Three things needed to be true simultaneously:

1. Cart survives a page refresh
2. No flash of empty cart on load
3. Any component can read the cart without prop drilling

The lazy `useState` initialiser (`useState(() => readCartFromStorage())`)
solves all three. It reads localStorage synchronously on the first render,
so the cart is populated before the first paint — no `useEffect` delay,
no empty-then-populated flicker. This pattern is correct for a Vite SPA
with no server-side rendering. The `useEffect` pattern (read after mount)
is the right default for SSR apps where hydration mismatches matter — it
is not the right default here.

`writeCartToStorage` is called inside the `setItems` functional updater
rather than in a separate `useEffect`. This guarantees localStorage is
always written atomically with the state update — there is no window
where React state and localStorage can be out of sync.

Cart item identity is defined as `(productId + colourId + sizeId)`. Adding
the same combination increments quantity rather than creating a duplicate
entry. This matches ecommerce convention and keeps the cart array clean.

`clearCart` calls `localStorage.removeItem` rather than writing `'[]'` —
removing the key entirely is cleaner storage hygiene and means
`readCartFromStorage` correctly returns `[]` on a missing key.

---

## Decision #7 — URL Variant Deep-Linking

**Chose: window.history.replaceState with validation on rehydration**

Selected colour and size are persisted in the URL as query parameters:
`?colour=slate-blue&size=20l`

`replaceState` is used instead of `pushState` — selecting a colour or
size is not a navigation event and should not create browser history
entries. The back button should not cycle through variant selections.

On page load, `getInitialColour` and `getInitialSize` validate the URL
params against the actual variant arrays before applying them. If the URL
contains a colour that doesn't exist (e.g. a stale link), it falls back
to the first available colour. If the URL contains a sold-out size, it
falls back to the first available size. The page is always in a valid
state regardless of what the URL contains.

All `window.location` and `window.history` access is encapsulated in
`utils/url.utils.ts`. No component touches these APIs directly.

---

## Decision #8 — Max Quantity Enforcement

**Chose: Derived state from cart items, not stored state**

The "maxed out" state for a variant is computed as:
`cartQuantity >= maxQty` where `maxQty = Math.min(stock, MAX_QUANTITY_PER_ORDER)`
and `cartQuantity` is read live from the cart items array.

This is derived state — `isMaxedOut` is never stored in `useState`. The
single source of truth is the cart items array in `CartContext`. Any
component that needs to know if a variant is maxed out reads from the
cart and computes it. This eliminates the possibility of the stored
maxed-out flag drifting out of sync with the actual cart contents.

The quantity picker is capped at `remainingQty` (stock minus what's
already in cart) rather than total stock. This prevents the user from
selecting a quantity that would exceed the stock limit given what's
already in their cart. The quantity resets to 1 when the size selection
changes — a new size is a fresh selection with its own remaining stock.
