# Product Dashboard

A small dashboard for an operations team to browse a product catalogue, filter and sort the list, view product details, and edit price and stock. Data comes from the [DummyJSON](https://dummyjson.com/docs/products) API, which simulates updates without actually persisting them. I'll note below where that affected design decisions.

Built with Next.js (App Router), TypeScript, Tailwind, and shadcn-style components on top of Base UI.

Live: [add your Vercel URL here before submitting]
Repo: https://github.com/Caleboc1/assessmentapp

## Running it locally

```bash
npm install
echo 'NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com' > .env.local
npm run dev
```

Open http://localhost:3000, which redirects to /products. For a production build: `npm run build && npm start`.

The only environment variable is `NEXT_PUBLIC_API_BASE_URL` (the DummyJSON base URL). It's an env var so the deployed build and local dev read from one place.

## What it covers

- Summary metrics: total products, low stock count, average rating, inventory value
- Product grid showing image, title, category, price, stock and rating
- Search (debounced 500ms), category filter, sorting, and pagination
- List state (search, category, sort, page) lives in the URL, so refreshing or sharing a link restores the exact view
- Product detail page with an edit form for price and stock, plus success/error feedback
- Loading, error and empty states; usable on mobile widths

## How it's put together

```
app/
  api/products.ts              # all DummyJSON calls, typed against types.ts
  products/page.tsx            # server shell + Suspense boundary
  products/ProductsClient.tsx  # client list: state, URL sync, fetching
  products/[id]/page.tsx       # server-rendered detail page
components/
  products/                    # list, card, filters, pagination, edit form
  dashboard/                   # metric cards
  ui/                          # base primitives
types.ts                       # product model shared by API layer and UI
```

A few decisions worth explaining:

**The list page is a client component on purpose.** It needs debounced input handling, refetching on filter changes, and URL updates as you interact. Making that a server component would mean a navigation round trip for every change. The server still renders the page shell and the Suspense fallback covers first paint.

**The detail page is server rendered.** It's one fetch and mostly static content, so it makes sense to render the product server-side and have HTML ready on load. The only client part is the edit form.

**Sorting happens on the API, not in the browser.** My first version sorted the current page's 12 products client-side, which is quietly wrong: the cheapest product in the catalogue might be on a different page. DummyJSON supports `sortBy` and `order`, so sorting now applies across the whole catalogue. The cost is a network round trip per sort change; the loading skeleton covers it.

**All API access lives in one module.** Components never call fetch directly or build query strings, so the API shape is defined in one place and components just consume typed data.

**No data-fetching library.** There are only a few interactions here, so pulling in TanStack Query felt like adding a dependency without changing the architecture. This is the first thing I'd add with more time, since I'm reimplementing a small slice of it (dedup, caching, retries) by hand.

## Assumptions and trade-offs

- **Metrics (other than total products) are computed from the currently loaded page**, not the whole catalogue. Total products uses the API's `total` field so it's accurate globally. Computing the rest catalogue-wide would mean fetching ~200 products on every filter change or inventing a stats endpoint that doesn't exist.
- **Search and category can't be combined.** DummyJSON's search endpoint doesn't accept a category, so when both are set, search wins. In a real product I'd filter the search results by category client-side.
- **No optimistic updates.** The simulated update endpoint doesn't persist, so optimistically showing a new price that silently reverts on refresh feels more broken than waiting for the response. The form shows a toast on success or failure and disables the button while saving. Against a real backend I'd do optimistic updates with rollback.
- **The URL is the source of truth for list state** rather than a global store. It keeps shareable state honest and removed a whole class of state-sync bugs.

## Known limitations

- Search + category filtering can't be combined (API limitation described above)
- Low stock / rating / inventory metrics are page-scoped
- Categories display as slugs because DummyJSON doesn't provide display names
- Updates don't survive a refresh (the API is simulated)
- No test suite. If I added one, I'd start with the sort-parameter mapping, the debounced search flow, and the edit form's success and error paths.

## What I'd improve with more time

1. TanStack Query for caching, request dedup and retries
2. Optimistic updates with rollback on the edit form
3. Client-side combining of search results with the selected category
4. Tests for the flows listed above
5. An error boundary per section instead of one page-level error state

## AI disclosure

I used Codebuff (an AI coding agent) while building this: it drafted some components, helped with edits, and ran builds. I reviewed, tested and understand all of the submitted code, and the decisions and trade-offs described here are mine.
