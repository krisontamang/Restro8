# Restro8: service first

## Direction
Use a calm, warm workspace with graphite text, restrained sage accents, and clear hierarchy. Keep familiar names such as Orders, KOT, Trial Balance and Balance Sheet. Replace copied grouping and promotional copy with task-based navigation.

## Implementation order
1. Build reusable headings, filter buttons, metrics, empty states and action controls.
2. Keep one navigation system across the restaurant and finance: Service, Menu & stock, Finance, Guests & team, Settings. Place POS, kitchen and tables within immediate reach. Make mobile groups expand without closing the drawer.
3. Share a plain KOT ticket between preview and print. Show real ticket number, table, creation time, options and instructions. Remove fabricated fallback data, tax identity clutter and claims that a printer succeeded.
4. Rebuild the kitchen queue: oldest first, quiet overdue indicators, readable quantities, joint station/type filtering, deliberate completion and accessible controls.
5. Replace the report directory with a searchable report library organized by decisions. Build real aggregations for sales, daily/monthly totals, collections, payment methods, open bills, discounts, menu/category performance and stock snapshots. Explain missing ledger prerequisites for accounting statements instead of relabeling order lists.
6. Replace the finance landing page with actual sales and collection totals plus clear routes to bookkeeping. Remove the copied video promotion and brand destinations.
7. Check the flows at 414×896 and desktop, keyboard operation, print isolation, build, lint and accounting regressions. Keep test sales separate from operational records.

## Data issues identified
- KOT previews currently insert a fixed date, sample instructions and fallback items.
- Report date currently follows updatedAt, allowing a kitchen status change to move revenue between days.
- Report names are classified by regular expressions; Trial Balance and purchase reports can display unrelated sales data.
- Existing menu cost is an estimate, not historical COGS or net profit.
- Guest ordering is browser-local; cross-device cloud delivery has not been configured. Do not claim remote delivery.
- Current table editor uses separate demo rows; it is not the same source as the floor and QR codes.
