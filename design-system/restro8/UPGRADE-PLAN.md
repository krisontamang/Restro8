# Restro8 premium workspace upgrade

## Intent
Keep the existing restaurant features and React/Vite architecture. Design distinct mobile (414 × 896 CSS pixels) and desktop experiences sharing business state. Preserve existing stored records.

## Direction
Forest green and restrained gold carry the existing identity into warm ivory surfaces. Use the existing Plus Jakarta Sans family, generous section spacing, tabular financial figures, and a custom infinity/dining mark. Mobile has a service summary, a five-item bottom navigation, and a reachable order ticket. Desktop has a persistent navigation rail, overview grid, and side-by-side catalog/ticket.

## Work sequence
1. Inspect existing routes, components, storage and connection behavior.
2. Upgrade brand assets, shared tokens, navigation and overview.
3. Improve POS, generated menu photography, mobile forms and dialogs.
4. Fix demonstrated persistence, stock validation and data-reporting defects; split heavy views.
5. Build/lint, verify browser flows at 414 × 896 and desktop, and document limitations.

## Follow-up delivery
- Added a public `/menu?table=<table-id>` guest menu with real stock-aware basket interactions.
- Replaced placeholder QR artwork with the `qrcode` package, table-derived links, PNG downloads, and black-and-white print sheets.
- Made every report directory item open a live, filterable report with 30/90/365-day periods, 12-month sales trend, CSV export, and plain print output.
- Simplified KOT/receipt printing to black ink on white paper and cleaned print lifecycle handling.
- Added deterministic random-order reporting tests covering a one-year window and menu profitability aggregation.

## Reference review
- UI UX Pro Max: use dashboard-oriented minimalism, responsive guidance, keyboard focus, contrast and 44px touch targets. Its first broad restaurant query returned marketing storytelling/glass recommendations, which were rejected as unsuitable for operations.
- https://github.com/shadcn-ui/ui — composable components and restrained surfaces.
- https://github.com/tremorlabs/tremor — clear metric and chart hierarchy.
- https://github.com/radix-ui/primitives — accessible dialog behavior.
These are reference patterns; keep the existing component API instead of migrating the entire application to a different framework.

## Data boundary
The inspected operational provider uses localStorage. A Supabase SDK client exists but no operational tables, authentication flow or sync wiring are defined in this repository. Do not label local state as cloud-connected or invent a remote schema for an unknown tenancy model. Improve actual storage and connection checks and state the remaining deployment work.

## Acceptance
No page-wide overflow at 414px. Main actions remain reachable at 896px height with safe-area clearance. Existing management options remain reachable. Menu search, customization, quantity, KOT creation, settlement, QR links, guest basket, report export, and plain print flows work in the browser. Build succeeds. Food assets reside in public and have transparent backgrounds.
