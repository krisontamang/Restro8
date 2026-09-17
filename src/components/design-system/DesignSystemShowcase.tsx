import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  Select,
  Textarea,
  SearchInput,
  NumberInput,
  Checkbox,
  Switch,
  FormField,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Panel,
  Divider,
  Tabs,
  Breadcrumb,
  Pagination,
  Badge,
  StatusIndicator,
  Alert,
  Skeleton,
  Progress,
  EmptyState,
  ErrorState,
  Modal,
  BottomSheet,
  ConfirmDialog,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
  MetricCard,
  ChartContainer,
  PriceDisplay,
  OrderStatusBadge,
  PaymentStatusBadge,
  TableStatusBadge,
  QuantityControl,
} from '../ui';
import {
  Sparkles,
  Search,
  Plus,
  TrendingUp,
  CreditCard,
  Utensils,
  Layers,
  CheckCircle,
  Package,
  Clock,
  Printer,
  Bell,
  Trash2,
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('foundations');
  const [searchValue, setSearchValue] = useState('');
  const [numberVal, setNumberVal] = useState(2);
  const [chkVal, setChkVal] = useState(true);
  const [switchVal, setSwitchVal] = useState(true);
  const [qtyVal, setQtyVal] = useState(3);
  const [page, setPage] = useState(1);

  // Modal & Sheet States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div
      className="r8-container-fluid"
      style={{
        padding: '24px',
        backgroundColor: 'var(--r8-bg-canvas)',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: 'var(--r8-brand-primary-subtle)',
                color: 'var(--r8-brand-primary)',
                padding: '4px 8px',
                borderRadius: 'var(--r8-radius-xs)',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}
            >
              RESTRO8 DS 1.0
            </span>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--r8-text-primary)',
                margin: 0,
              }}
            >
              Design System Showcase & Visual QA
            </h1>
          </div>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--r8-text-secondary)',
              margin: '4px 0 0 0',
            }}
          >
            Canonical UI Foundation, Design Tokens & Domain Components for RESTRO8
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Printer size={14} />}
            onClick={() => window.print()}
          >
            Export Spec
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Sparkles size={14} />}
            onClick={() => setIsModalOpen(true)}
          >
            Test Modal
          </Button>
        </div>
      </div>

      {/* Showcase Scope Tabs */}
      <Tabs
        variant="segmented"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'foundations', label: '1. Tokens & Foundations' },
          { id: 'buttons', label: '2. Buttons & Inputs' },
          { id: 'surfaces', label: '3. Surfaces & Feedback' },
          { id: 'data', label: '4. Tables & Metrics' },
          { id: 'restaurant', label: '5. Restaurant Domain' },
        ]}
        style={{ marginBottom: '24px' }}
      />

      {/* TAB 1: FOUNDATIONS & TOKENS */}
      {activeTab === 'foundations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Brand Palette Strip */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>RESTRO8 Two-Color Brand System</CardTitle>
              <CardDescription>
                Emerald Teal + Prosperity Gold + Pure White (#FFFFFF) + AMOLED Black (#000000)
              </CardDescription>
            </CardHeader>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                { name: 'Primary 01: Emerald Teal', val: 'var(--r8-brand-primary)', hex: '#0F8F6F / #19B889' },
                { name: 'Primary 02: Prosperity Gold', val: 'var(--r8-brand-gold)', hex: '#F2B84B / #F4C15D' },
                { name: 'Pure White (Light Canvas)', val: 'var(--restro8-background, #FFFFFF)', hex: '#FFFFFF' },
                { name: 'AMOLED Black (Dark Canvas)', val: 'var(--restro8-background-dark, #000000)', hex: '#000000' },
                { name: 'Sidebar Active Nav', val: 'var(--r8-sidebar-active-bg)', hex: '#E8F7F2 / #062D25' },
                { name: 'Semantic Success', val: 'var(--r8-semantic-success)', hex: '#10B981' },
                { name: 'Semantic Warning', val: 'var(--r8-semantic-warning)', hex: '#F59E0B' },
                { name: 'Semantic Danger', val: 'var(--r8-semantic-danger)', hex: '#EF4444' },
              ].map((c) => (
                <div
                  key={c.name}
                  style={{
                    backgroundColor: 'var(--r8-bg-surface)',
                    border: '1px solid var(--r8-border-subtle)',
                    borderRadius: 'var(--r8-radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ height: '48px', backgroundColor: c.val, borderBottom: '1px solid var(--r8-border-subtle)' }} />
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                      {c.name}
                    </div>
                    <div className="r8-tabular-num" style={{ fontSize: '0.7rem', color: 'var(--r8-text-muted)' }}>
                      {c.hex}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Typography Scale */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Typography System</CardTitle>
              <CardDescription>
                Inter (Sans) & JetBrains Mono (Tabular Numerals)
              </CardDescription>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span style={{ width: '120px', fontSize: '0.75rem', color: 'var(--r8-text-muted)' }}>
                  Display Lg (28px)
                </span>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
                  RESTRO8 Culinary OS
                </span>
              </div>
              <Divider margin="sm" />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span style={{ width: '120px', fontSize: '0.75rem', color: 'var(--r8-text-muted)' }}>
                  Title Primary (20px)
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                  Active Table Orders & Fiscal Billing
                </span>
              </div>
              <Divider margin="sm" />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span style={{ width: '120px', fontSize: '0.75rem', color: 'var(--r8-text-muted)' }}>
                  Body (14px)
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--r8-text-secondary)' }}>
                  Every paisa and gram counts. Zero ambiguity in pricing or inventory deductions.
                </span>
              </div>
              <Divider margin="sm" />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span style={{ width: '120px', fontSize: '0.75rem', color: 'var(--r8-text-muted)' }}>
                  Tabular Numbers
                </span>
                <span className="r8-tabular-num" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                  Rs. 1,48,920.00 &bull; KOT #0429 &bull; 00:14:32
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: BUTTONS & INPUTS */}
      {activeTab === 'buttons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card padding="md">
            <CardHeader>
              <CardTitle>Button Variants & States</CardTitle>
              <CardDescription>
                Canonical button hierarchy ensuring only ONE primary action per screen
              </CardDescription>
            </CardHeader>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" leftIcon={<Utensils size={16} />}>
                Fire KOT (Primary)
              </Button>
              <Button variant="accent" hotkey="F9" leftIcon={<CreditCard size={16} />}>
                Take Payment
              </Button>
              <Button variant="secondary" leftIcon={<Package size={16} />}>
                Secondary
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive" leftIcon={<Trash2 size={16} />}>
                Void Item
              </Button>
              <Button variant="success" leftIcon={<CheckCircle size={16} />}>
                Complete
              </Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>

            <Divider margin="md" />

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--r8-text-muted)', width: '80px' }}>
                Sizes:
              </span>
              <Button size="sm" variant="secondary">Small (32px)</Button>
              <Button size="md" variant="secondary">Medium (40px)</Button>
              <Button size="lg" variant="primary">Large (48px Touch)</Button>
              <IconButton icon={<Bell size={16} />} label="Alerts" variant="secondary" size="md" />
              <IconButton icon={<Plus size={18} />} label="Add" variant="primary" size="lg" />
            </div>
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Form Controls & Inputs</CardTitle>
              <CardDescription>
                Touch-friendly heights with explicit labels and error states
              </CardDescription>
            </CardHeader>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              <FormField label="Item Name" required hint="Display name printed on KOT and bill">
                <Input placeholder="e.g. Chicken Mo:Mo (Steam)" />
              </FormField>

              <FormField label="Menu Category" required>
                <Select
                  options={[
                    { value: 'mains', label: 'Main Course' },
                    { value: 'starters', label: 'Starters / Appetizers' },
                    { value: 'beverages', label: 'Beverages & Bar' },
                  ]}
                />
              </FormField>

              <FormField label="Search Catalog (Global)">
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Quick search dishes, tables, bills..."
                />
              </FormField>

              <FormField label="Guest Covers (Table 4)">
                <NumberInput value={numberVal} onChange={setNumberVal} min={1} max={20} />
              </FormField>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Checkbox
                checked={chkVal}
                onChange={(e) => setChkVal(e.target.checked)}
                label="Apply 13% IRD VAT"
                description="Fiscal tax compliance invoice"
              />
              <Switch
                checked={switchVal}
                onChange={setSwitchVal}
                label="Auto-Print KOT on Fire"
                description="Route to Kitchen thermal printer"
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <FormField label="Special Kitchen Instructions">
                <Textarea placeholder="e.g. Less spicy, strictly no onions, serve drinks first..." rows={2} />
              </FormField>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: SURFACES & FEEDBACK */}
      {activeTab === 'surfaces' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card Styles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            <Card variant="default">
              <CardTitle>Default Surface</CardTitle>
              <CardDescription>Standard 1px border card</CardDescription>
              <CardContent style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '0.84rem', color: 'var(--r8-text-secondary)', margin: 0 }}>
                  Structured content boundary with subtle shadow.
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Hover & active micro-interactions</CardDescription>
              <CardContent style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '0.84rem', color: 'var(--r8-text-secondary)', margin: 0 }}>
                  Used for POS dish tiles, floor tables, and order tickets.
                </p>
              </CardContent>
            </Card>

            <Card variant="selected">
              <CardTitle>Selected State</CardTitle>
              <CardDescription>Electric Cyan highlight boundary</CardDescription>
              <CardContent style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '0.84rem', color: 'var(--r8-text-primary)', margin: 0 }}>
                  Active table or currently inspected order ticket.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Badges & Status Indicators */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Badges & Status Cues</CardTitle>
              <CardDescription>
                Non-color redundant indicators for scannability
              </CardDescription>
            </CardHeader>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge variant="primary" dot>Primary Tag</Badge>
              <Badge variant="success" dot>Paid / Settled</Badge>
              <Badge variant="warning" dot>Pending Action</Badge>
              <Badge variant="danger" dot>Cancelled</Badge>
              <Badge variant="info" dot>Reserved</Badge>
              <Badge variant="neutral">Neutral SKU</Badge>
            </div>
            <Divider margin="md" />
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <StatusIndicator status="online" label="Sync Online (WebSocket Active)" pulse />
              <StatusIndicator status="warning" label="Printer Paper Low" />
              <StatusIndicator status="alert" label="KDS Delayed (>20m)" pulse />
              <StatusIndicator status="offline" label="Offline Terminal" />
            </div>
          </Card>

          {/* Alerts & Feedback */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Alert
              severity="warning"
              title="Thermal Printer Paper Warning"
              onClose={() => {}}
            >
              Kitchen Line Printer (192.168.1.120) reports low paper roll. Replace before the lunch rush.
            </Alert>
            <Alert
              severity="error"
              title="Manager Authorization Required"
            >
              Order #1042 contains 2 fired items. Voiding requires Manager PIN.
            </Alert>
            <Alert
              severity="success"
              title="Daily Register Closed Successfully"
            >
              Z-Report #89 printed. Zero cash discrepancy recorded for Shift A.
            </Alert>
          </div>

          {/* Overlays Triggers */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Overlays & Drawers</CardTitle>
              <CardDescription>Predictable focus-locked overlay behavior</CardDescription>
            </CardHeader>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                Open Standard Modal
              </Button>
              <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
                Open Mobile Bottom Sheet
              </Button>
              <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: DATA & METRICS */}
      {activeTab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KPI Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <MetricCard
              label="Today's Sales"
              currencyPrefix="Rs."
              value="84,350.00"
              change={12.4}
              changeLabel="vs yday"
              variant="primary"
              icon={<TrendingUp size={18} />}
            />
            <MetricCard
              label="Active Covers"
              value="42 / 65"
              subtext="64% Occupancy"
              variant="success"
              icon={<Utensils size={18} />}
            />
            <MetricCard
              label="Open Tickets"
              value="14 Active"
              subtext="2 Exceeding 15m"
              variant="warning"
              icon={<Clock size={18} />}
            />
            <MetricCard
              label="IRD VAT Accrued"
              currencyPrefix="Rs."
              value="9,704.87"
              subtext="13% Fiscal Book"
              variant="default"
              icon={<Layers size={18} />}
            />
          </div>

          {/* Canonical Data Table */}
          <Card padding="none">
            <div style={{ padding: '16px' }}>
              <CardTitle>Recent Orders & Fiscal Invoices</CardTitle>
              <CardDescription>
                Tabular alignment, right-aligned monetary values, sticky header
              </CardDescription>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Bill / Invoice</TableHeadCell>
                  <TableHeadCell>Table / Type</TableHeadCell>
                  <TableHeadCell>Server</TableHeadCell>
                  <TableHeadCell>Items</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell numeric>Subtotal</TableHeadCell>
                  <TableHeadCell numeric>13% VAT</TableHeadCell>
                  <TableHeadCell numeric>Grand Total (NPR)</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 'INV-2081-0492', table: 'Table 4 (Dine-In)', server: 'Anil K.', items: '4 items', status: 'paid', sub: 820.0, vat: 106.6, total: 926.6 },
                  { id: 'INV-2081-0493', table: 'Table 12 (Rooftop)', server: 'Pooja S.', items: '6 items', status: 'preparing', sub: 1650.0, vat: 214.5, total: 1864.5 },
                  { id: 'INV-2081-0494', table: 'Takeaway #18', server: 'Counter', items: '2 items', status: 'ready', sub: 450.0, vat: 58.5, total: 508.5 },
                  { id: 'INV-2081-0495', table: 'Table 7 (Indoor)', server: 'Bikash T.', items: '3 items', status: 'draft', sub: 710.0, vat: 92.3, total: 802.3 },
                ].map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ fontWeight: 600 }}>{row.id}</TableCell>
                    <TableCell>{row.table}</TableCell>
                    <TableCell>{row.server}</TableCell>
                    <TableCell>{row.items}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={row.status as any} size="sm" />
                    </TableCell>
                    <TableCell numeric>Rs. {row.sub.toFixed(2)}</TableCell>
                    <TableCell numeric>Rs. {row.vat.toFixed(2)}</TableCell>
                    <TableCell numeric style={{ fontWeight: 700, color: 'var(--r8-text-primary)' }}>
                      Rs. {row.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div style={{ padding: '8px 16px' }}>
              <Pagination
                currentPage={page}
                totalPages={8}
                totalItems={78}
                pageSize={10}
                onPageChange={setPage}
              />
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: RESTAURANT DOMAIN FOUNDATIONS */}
      {activeTab === 'restaurant' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card padding="md">
            <CardHeader>
              <CardTitle>Nepal Currency & Price Display</CardTitle>
              <CardDescription>
                Tabular monospaced figures with optional VAT inclusion notes
              </CardDescription>
            </CardHeader>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--r8-text-muted)', display: 'block' }}>
                  Small (Cart item):
                </span>
                <PriceDisplay amount={280} size="sm" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--r8-text-muted)', display: 'block' }}>
                  Medium (Catalog item):
                </span>
                <PriceDisplay amount={850} originalAmount={950} size="md" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--r8-text-muted)', display: 'block' }}>
                  Large (Table subtotal):
                </span>
                <PriceDisplay amount={3420} size="lg" showVatNote />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--r8-text-muted)', display: 'block' }}>
                  X-Large (Grand Payable):
                </span>
                <PriceDisplay amount={14890} size="xl" />
              </div>
            </div>
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Floor Table Status Badges</CardTitle>
              <CardDescription>
                High-visibility status nodes with duration counters
              </CardDescription>
            </CardHeader>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <TableStatusBadge status="available" />
              <TableStatusBadge status="occupied" durationMinutes={34} />
              <TableStatusBadge status="reserved" />
              <TableStatusBadge status="dirty" />
            </div>
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Fast POS Cart Quantity Stepper</CardTitle>
              <CardDescription>
                Minimum 44px touch targets with auto-delete on zero option
              </CardDescription>
            </CardHeader>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--r8-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Standard Cart Stepper:
                </span>
                <QuantityControl
                  quantity={qtyVal}
                  onIncrease={() => setQtyVal((q) => q + 1)}
                  onDecrease={() => setQtyVal((q) => Math.max(1, q - 1))}
                  onRemove={() => setQtyVal(1)}
                  size="md"
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--r8-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Large Touch Screen (KDS / Fast POS):
                </span>
                <QuantityControl
                  quantity={qtyVal}
                  onIncrease={() => setQtyVal((q) => q + 1)}
                  onDecrease={() => setQtyVal((q) => Math.max(1, q - 1))}
                  onRemove={() => setQtyVal(1)}
                  size="lg"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* REUSABLE MODALS / SHEETS FOR INTERACTIVE TESTING */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manager Void Authorization"
        description="Verify manager credentials to void item on Table 4"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsModalOpen(false)}>
              Authorize Void
            </Button>
          </>
        }
      >
        <FormField label="Manager PIN (4 Digits)" required>
          <Input type="password" maxLength={4} placeholder="••••" />
        </FormField>
        <div style={{ marginTop: '12px' }}>
          <FormField label="Reason for Void" required>
            <Select
              options={[
                { value: 'guest_change', label: 'Guest changed mind' },
                { value: 'wrong_punch', label: 'Wrong item punched' },
                { value: 'quality_issue', label: 'Food quality / return' },
              ]}
            />
          </FormField>
        </div>
      </Modal>

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Table 4 — Quick Order Summary"
        footer={
          <Button variant="primary" fullWidth onClick={() => setIsSheetOpen(false)}>
            Proceed to Payment (Rs. 926.60)
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>2x Chicken Mo:Mo</span>
            <span className="r8-tabular-num">Rs. 560.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>1x Diet Coke 500ml</span>
            <span className="r8-tabular-num">Rs. 90.00</span>
          </div>
          <Divider margin="sm" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Grand Total (13% VAT incl.)</span>
            <span className="r8-tabular-num" style={{ color: 'var(--r8-brand-primary)' }}>
              Rs. 926.60
            </span>
          </div>
        </div>
      </BottomSheet>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => setIsConfirmOpen(false)}
        title="Confirm Item Cancellation"
        message="Are you sure you want to cancel 1x Buff Chowmein from KOT #0429? Kitchen will be notified."
        confirmLabel="Cancel Item"
        variant="danger"
      />
    </div>
  );
};
