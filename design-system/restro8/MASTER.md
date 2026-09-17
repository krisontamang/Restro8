# RESTRO8 — Design System Master Specification

> **Status:** Production Foundation (Level 4 Implementation)  
> **Source of Truth:** Level 3 Brand Identity & Visual Direction  
> **Target Environment:** Counter POS Terminals, Kitchen Display Systems (KDS), Mobile Waiter Handhelds (390×844 Portrait), and Back-Office Desktops.

---

## 1. Architectural Philosophy

RESTRO8 is an industrial-grade digital instrument for culinary professionals.
Every component and token adheres to 5 strict rules:
1. **One Primary Action per View:** Never compete for the operator's attention.
2. **Tabular Monospaced Numbers:** All currency figures, timestamps, and stock counts use `font-variant-numeric: tabular-nums` (`--r8-font-mono`).
3. **Ergonomic Density:** 44px minimum touch targets on mobile & touch terminals; 32px–40px dense controls on desktop data tables.
4. **Restrained Color Usage:** 85% neutral slate and charcoal surfaces; high-saturation colors are strictly functional.
5. **No Page-Level Horizontal Overflow:** All tables, forms, and charts must adapt to their container width.

---

## 2. Design Tokens (`src/index.css`)

### RESTRO8 Two-Color Brand System
| Token Name | Light Mode | AMOLED Dark Mode | Role & Meaning |
| :--- | :--- | :--- | :--- |
| `--restro8-emerald` (`--r8-brand-primary`) | `#0F8F6F` | `#19B889` | **Primary Brand 01 (Growth)**: Primary actions, active nav, checkout, focus rings |
| `--restro8-gold` (`--r8-brand-gold`) | `#F2B84B` | `#F4C15D` | **Primary Brand 02 (Prosperity)**: Revenue highlights, rewards, business insights |
| `--r8-brand-emerald-hover` | `#087A60` | `#24C79B` | Primary button & control hover state |
| `--r8-sidebar-active-bg` | `#E8F7F2` | `#062D25` | Active navigation background |
| `--r8-sidebar-active-text` | `#087A60` | `#39CFA2` | Active navigation label |
| `--r8-sidebar-active-indicator` | `#0F8F6F` | `#19B889` | Active navigation indicator bar |

### Functional Semantic States (Not Brand Colors)
| Semantic Token | Value | Functional Role |
| :--- | :--- | :--- |
| `--restro8-success` (`--r8-semantic-success`) | `#10B981` | Completed orders, settled payments, verified IRD |
| `--restro8-warning` (`--r8-semantic-warning`) | `#F59E0B` | Pending kitchen tickets, threshold alerts |
| `--restro8-danger` (`--r8-semantic-danger`) | `#EF4444` | Voids, cancellations, kitchen bottlenecks |
| Information State | Emerald System | Governed by RESTRO8 Emerald system |

### Surface Hierarchy (Pure White Light / True AMOLED Black Dark)
| Token | Light Mode (Extra White) | Dark Mode (True AMOLED Black) |
| :--- | :--- | :--- |
| `--restro8-background` (`--r8-bg-canvas`) | `#FFFFFF` (Pure White) | `#000000` (True AMOLED Black) |
| `--restro8-surface` (`--r8-bg-surface`) | `#FFFFFF` | `#050505` (Deep Black Surface) |
| `--restro8-surface-soft` (`--r8-bg-subtle`) | `#F8FAFC` (Soft Neutral) | `#0A0A0A` (Secondary Surface) |
| `--r8-bg-elevated` | `#FFFFFF` | `#0A0A0A` |
| `--restro8-border` (`--r8-border-subtle`) | `#E5E7EB` | `#1F2937` / `#27272A` |
| `--restro8-text` (`--r8-text-primary`) | `#111827` | `#FFFFFF` |
| `--restro8-text-secondary` (`--r8-text-secondary`) | `#64748B` | `#A1A1AA` |

### Spacing Grid (8pt + 4pt micro-step)
- `--r8-space-1`: `4px` (Tags, icon micro-spacing)
- `--r8-space-2`: `8px` (Compact gap, badge padding)
- `--r8-space-3`: `12px` (Standard input horizontal padding)
- `--r8-space-4`: `16px` (Card interior padding, grid gutter)
- `--r8-space-6`: `24px` (Canvas outer margin, split section gap)
- `--r8-space-8`: `32px` (Major section separator)

### Border Radii
- `--r8-radius-xs`: `4px` (Micro-tags, dietary chips)
- `--r8-radius-sm`: `6px` (Standard buttons, form inputs, table corners)
- `--r8-radius-md`: `10px` (Cards, POS menu tiles, table cards)
- `--r8-radius-lg`: `16px` (Dialogs, flyout drawers, mobile bottom sheets)
- `--r8-radius-full`: `9999px` (Pills, badges, search bar)

---

## 3. Component Architecture (`src/components/ui/`)

```
src/components/ui/
├── index.ts                # Central barrel export
├── Button.tsx              # Button (primary, secondary, accent, ghost, destructive, success)
├── IconButton.tsx          # Accessible icon trigger (44px touch target)
├── Input.tsx               # Text input with icon support and validation states
├── Select.tsx              # Styled accessible dropdown
├── Textarea.tsx            # Multiline note input
├── SearchInput.tsx         # Quick search bar with clear button & hotkey pill
├── NumberInput.tsx         # Numeric touch stepper with + and - buttons
├── Checkbox.tsx            # Accessible checkbox with description
├── Switch.tsx              # Touch slider toggle
├── FormField.tsx           # Wrapper with label, required asterisk, hint & error
├── Card.tsx                # Card container with Header, Title, Content, Footer
├── Panel.tsx               # Minimalist spatial divider container
├── Divider.tsx             # 1px horizontal / vertical divider
├── Tabs.tsx                # Tabs in pill, underline, or segmented styles
├── Breadcrumb.tsx          # Navigation trail
├── Pagination.tsx          # Table page controller with entry count
├── Badge.tsx               # Semantic tag with dot and variant support
├── StatusIndicator.tsx     # Pulsing online/offline/delayed indicator
├── Alert.tsx               # Informative and action-blocking alert boxes
├── Skeleton.tsx            # Shimmer loading placeholder
├── Progress.tsx            # Horizontal percentage bar
├── EmptyState.tsx          # Standard empty dataset guidance
├── ErrorState.tsx          # Standard error boundary with retry trigger
├── Modal.tsx               # Accessible central dialog with backdrop
├── BottomSheet.tsx         # Mobile-first slide-up drawer
├── ConfirmDialog.tsx       # Destructive confirmation modal
├── Table.tsx               # Responsive table suite with tabular alignment
├── MetricCard.tsx          # KPI card with currency, value, delta, and icon
├── ChartContainer.tsx      # Overflow-protected chart wrapper
└── restaurant/
    ├── PriceDisplay.tsx    # NPR currency formatter with VAT notes
    ├── OrderStatusBadge.tsx# Order lifecycle badge (Draft to Paid)
    ├── PaymentStatusBadge.tsx # Settle status badge (Paid, Pending, Refunded)
    ├── TableStatusBadge.tsx# Floor status badge with duration timer
    └── QuantityControl.tsx # Touch-optimized cart stepper
```

---

## 4. Development & QA Route

To inspect and test the components interactively in any viewport or lighting condition:
- Route tab: `design-system`
- Hotkey: Press `9` on desktop
- Top navigation: Click **Design System** button
