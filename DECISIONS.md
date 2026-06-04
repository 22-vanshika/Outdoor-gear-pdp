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

---

## Decision #9 — Cart Drawer vs Separate Cart Page

**Chose: Slide-in drawer**

A separate cart page requires routing, a new URL, and navigates the user
away from the PDP — they lose their place and have to navigate back to
continue shopping. A slide-in drawer keeps the user on the PDP, lets them
review their cart and return to shopping in one dismiss gesture, and is
the established ecommerce convention for single-product pages.

The drawer state (isCartOpen, openCart, closeCart) lives in CartContext
rather than a new UIContext. The cart is the only global UI concern in
this application — adding a second context for one boolean would be
over-engineering. If the application grew to have multiple drawers or
modals, that decision would be revisited.

Mobile behaviour differs from desktop: the drawer slides up from the
bottom as a full-width sheet rather than from the right. This matches
mobile ecommerce convention — a right-slide on mobile wastes horizontal
space and creates awkward touch targets.

---

## Decision #10 — Per-Colour Variant Stock Model

**Chose: ColourVariant with nested sizes**

The initial implementation shared one stock level across all colours for
each size. This is unrealistic — in practice, a product in Slate Blue /
20L may have 8 units while the same product in Obsidian Black / 20L may
be sold out.

The type was restructured from a flat `VariantConfig` with separate
`colours[]` and `sizes[]` arrays to `ColourVariant[]` where each colour
owns its size array with independent stock levels. This is a more honest
model and produces meaningfully different UI behaviour: switching colour
updates the size selector to reflect that colour's specific availability,
and resets the active size to the first available option for the new colour.

The trade-off is that stock data is now duplicated across colours for
sizes that happen to share the same availability. In a real application
this would come from an API that returns per-SKU stock. Here it is
configured in `variantConfig.ts` and the duplication is acceptable for
a static configuration layer.

---

## Decision #11 — maxQuantity Stored on CartItem

**Chose: Store maxQuantity at add-time on the CartItem**

The cart drawer needs to enforce stock limits on the quantity increment
button. Two options:

- Pass variant data into the cart layer so the drawer can look up stock
- Store the max quantity on the CartItem when it is first added

The second approach keeps the cart layer self-contained. CartContext
does not need to know about products or variants — it only needs to know
the maximum quantity for each item it already holds. `maxQuantity` is
set once at add-time as `Math.min(stock, MAX_QUANTITY_PER_ORDER)` and
travels with the item through localStorage. If stock changes between
sessions, the cap may be stale — acceptable for this scope.

---

## Decision #12 — Below-Fold Lazy Loading Strategy

**Chose: React.lazy + Suspense from the start**

The below-fold details section (tabs, specs, reviews) is not visible on
page load. Loading it eagerly adds ~15–20KB to the initial bundle for
content the user may never scroll to. React.lazy splits it into a
separate chunk that loads only when the Suspense boundary first renders.

The implementation is a single wrapper in App.tsx:

```ts
const ProductTabs = lazy(() =>
  import("@/components/details").then((m) => ({ default: m.ProductTabs })),
);
```

The Suspense fallback is a minimal loading label — not a skeleton, not
a spinner. The content is below the fold so the fallback is rarely
visible in practice.

The trade-off: if the user scrolls immediately and the network is slow,
they see the fallback briefly. This is acceptable — the above-fold
content (gallery, product info) is always available immediately.

---

## Decision #13 — Below-Fold Static Data Layer

**Chose: productDetails.ts alongside variantConfig.ts**

The Fake Store API returns no description content, no specifications,
and no reviews. The same enrichment pattern used for variants was
applied here — static local data in `src/data/productDetails.ts` that
is honest about its origin.

The alternative was to embed the content directly in the components as
hardcoded strings. Keeping it in a data file means:

- The content has a single source of truth
- All three panels (Description, Specifications, Reviews) draw from
  the same import
- The data shape is typed — `ProductDetailsData` with explicit
  interfaces for each panel

In a real application this data would come from a CMS or a product
content API. The architecture is designed to make that swap easy —
replace the static import with an API call in a service function and
the components don't change.

---

## Decision #14 — Precision Engineering Section: Bento vs Uniform Grid

**Chose: Bento grid on desktop, stacked feature cards on mobile**

The Precision Engineering section needed to showcase four product
capabilities. Two layout options were considered:

- **Uniform grid** — all four cells identical in size, same content
  (feature cards with icon + label + description) on both viewports.
  Simple, consistent, easy to maintain.
- **Bento grid** — desktop uses a mixed layout with two image cards
  (large and small) and three feature cards in a 3-column grid.
  Mobile shows four stacked feature cards with no images.

I chose the bento approach because the desktop viewport has enough
space to make the image cards visually impactful — they add product
photography context that feature cards alone cannot. On mobile,
image cards in a stacked layout become awkward and take up too much
vertical space, so the mobile version uses feature cards exclusively.

The two viewports render different DOM — `.bento` is hidden on mobile
via CSS, `.mobile-stack` is hidden on desktop. This is a deliberate
trade-off: slight HTML duplication in exchange for the cleanest
possible layout on each viewport without complex responsive hacks.

Content data is hardcoded directly in the component rather than in a
separate data file — the audit confirmed `precisionEngineering.ts` was
dead code once the bento layout was finalised, so it was removed.

---

---

## Decision #15 — Footer: Single Component vs Separate Column Components

**Chose: Single Footer component with internal data arrays**

The footer has three distinct regions on desktop (brand, link columns,
newsletter) and a different layout on mobile (brand, 2-column link grid,
newsletter). Two approaches were considered:

- **Separate components** — `FooterBrand`, `FooterLinks`, `FooterNewsletter`
  composed inside a `Footer` wrapper. Clean separation, but three extra
  component folders for what is essentially one UI region with no reuse.
- **Single component with internal arrays** — `SHOP_LINKS` and
  `SUPPORT_LINKS` as constants inside the component file, rendered
  conditionally per viewport via CSS show/hide.

I chose the single component approach. The footer has no external
consumers — nothing else renders `FooterLinks` or `FooterNewsletter`
independently. Splitting it would create components whose only purpose
is to be used once inside `Footer`, which violates the spirit of the
single responsibility principle rather than serving it.

The mobile layout merges all links into one flat 2-column grid
(`ALL_LINKS = [...SHOP_LINKS, ...SUPPORT_LINKS]`). The desktop layout
shows them in separate columns with headings. This is handled entirely
in CSS via `.desktop-col { display: none on mobile }` — no conditional
rendering in JSX, no duplicate data.

The newsletter form uses a controlled input with local `useState` —
appropriate since the form state is purely local to the footer and has
no global consumers.

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
Lighthouse mobile scores 89 — the main drag is LCP at 3.7s on slow 4G throttling,
caused entirely by Unsplash images loading at full resolution over a simulated slow
connection. With more time I would use Unsplash's width parameter more aggressively
(`?w=400` for thumbnails, `?w=600` for the primary image on mobile via srcset), add
`fetchpriority="high"` to the primary image, and convert to WebP. Desktop scores 99
because the same images load fast on an unthrottled connection. The fix is purely
at the image delivery layer — no architectural changes needed.

**5. Error boundary**
The current error state in `useProduct` renders an inline error message. A proper
implementation would use a React error boundary component so API failures don't
break the entire page render.

**6. Focus trap in cart drawer**
The cart drawer moves focus to the drawer on open but does not trap it — a keyboard
user can tab outside the drawer while it is open. A complete implementation would
use a focus trap (either a small library or manual tabindex management) to keep
focus within the dialog until it is dismissed. Not implemented due to time
constraints.

**7. Navbar routing**
The navbar links (Shop All, Apparel, Equipment, Journal) are static anchors with no
routing. A complete implementation would use React Router with actual routes. The
router directory was scaffolded but left empty — adding routes was deferred because
the assignment scope is a single PDP, not a multi-page application.

**8. Newsletter form**
The newsletter input clears on submit but has no success state, no error
handling, and no actual API call. A complete implementation would wire it to
an email service (Mailchimp, ConvertKit, or a simple backend endpoint), show
a success message on submission, and handle network errors inline.
