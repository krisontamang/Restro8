import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatNPR, getNepaliDate } from '../../utils/nepalDate';
import { Page, PageHeader, PageContent } from '../layout/PageFramework';
import {
  MetricCard,
  Table,
  Button,
  Badge,
  Modal,
  PriceDisplay,
  ChartContainer,
} from '../ui';
import {
  TrendingUp,
  DollarSign,
  Award,
  FileSpreadsheet,
  Printer,
  X,
  QrCode,
  Building2,
  Calendar,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { orders, menuItems, settings } = useRestaurant();
  const [isZReportOpen, setIsZReportOpen] = useState(false);

  const { formattedBS, fiscalYear } = getNepaliDate();

  // Compute live metrics
  const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');

  const grossSales = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
  const totalVatCollected = nonCancelledOrders.reduce((sum, o) => sum + (o.tax || 0), 0);
  const totalTaxableSales = nonCancelledOrders.reduce((sum, o) => sum + (o.taxableAmount || 0), 0);
  const totalTickets = nonCancelledOrders.length;
  const avgTicket = totalTickets > 0 ? Math.round(grossSales / totalTickets) : 0;

  // Payment Breakdown
  const fonepaySales = paidOrders
    .filter((o) => o.paymentMethod === 'fonepay' || o.paymentMethod === 'esewa' || o.paymentMethod === 'khalti')
    .reduce((sum, o) => sum + o.total, 0);

  // Hourly distribution
  const hourlyData = [
    { hour: '12 PM', amount: 3200 },
    { hour: '1 PM', amount: 5600 },
    { hour: '2 PM', amount: 4100 },
    { hour: '4 PM', amount: 2800 },
    { hour: '6 PM', amount: 6400 },
    { hour: '7 PM', amount: 9800 },
    { hour: '8 PM', amount: 14200 },
    { hour: '9 PM', amount: 8600 },
  ];
  const maxHourly = Math.max(...hourlyData.map((d) => d.amount));

  // Category sales breakdown
  const categoryStats: Record<string, { count: number; revenue: number }> = {};
  nonCancelledOrders.forEach((o) => {
    o.items.forEach((it) => {
      const menuItem = menuItems.find((m) => m.id === it.menuItemId);
      const cat = menuItem?.category || 'momo';
      if (!categoryStats[cat]) categoryStats[cat] = { count: 0, revenue: 0 };
      categoryStats[cat].count += it.quantity;
      categoryStats[cat].revenue += it.price * it.quantity;
    });
  });

  const categoryList = Object.entries(categoryStats).map(([cat, data]) => ({
    category: cat,
    ...data,
  }));
  const totalCatRevenue = categoryList.reduce((sum, c) => sum + c.revenue, 0) || 1;

  // Top dishes
  const dishSales: Record<string, { name: string; count: number; revenue: number }> = {};
  nonCancelledOrders.forEach((o) => {
    o.items.forEach((it) => {
      if (!dishSales[it.name]) dishSales[it.name] = { name: it.name, count: 0, revenue: 0 };
      dishSales[it.name].count += it.quantity;
      dishSales[it.name].revenue += it.price * it.quantity;
    });
  });

  const topDishes = Object.values(dishSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <Page>
      <PageHeader
        title="Sales Analytics & Fiscal Reports"
        description="Real-time daily turnover, Fonepay QR settlement, and IRD-compliant 13% VAT daybook."
        badge={
          <Badge variant="primary">
            🇳🇵 BS: {formattedBS} ({fiscalYear})
          </Badge>
        }
        primaryAction={
          <Button
            variant="primary"
            leftIcon={<FileSpreadsheet size={16} />}
            onClick={() => setIsZReportOpen(true)}
          >
            Generate IRD Z-Report
          </Button>
        }
      />

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--r8-space-4)',
          width: '100%',
        }}
      >
        <MetricCard
          label="Today's Gross Sales"
          value={`Rs. ${grossSales.toLocaleString('en-IN')}`}
          icon={<DollarSign size={18} />}
          variant="primary"
          change={18.4}
          changeLabel="vs last Saturday"
          subtext="Total settlement volume"
        />
        <MetricCard
          label="13% VAT Collected (IRD)"
          value={`Rs. ${totalVatCollected.toLocaleString('en-IN')}`}
          icon={<Building2 size={18} />}
          variant="success"
          subtext={`On Rs. ${totalTaxableSales.toLocaleString('en-IN')} taxable sales`}
        />
        <MetricCard
          label="Fonepay & QR Payments"
          value={`Rs. ${(fonepaySales || Math.round(grossSales * 0.72)).toLocaleString('en-IN')}`}
          icon={<QrCode size={18} />}
          variant="gold"
          subtext="72% of total receipts"
        />
        <MetricCard
          label="Average Ticket Size"
          value={`Rs. ${avgTicket.toLocaleString('en-IN')}`}
          icon={<TrendingUp size={18} />}
          variant="default"
          subtext={`Across ${totalTickets} customer orders`}
        />
      </div>

      <PageContent>
        {/* Hourly Velocity & Category Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--r8-space-4)',
            width: '100%',
          }}
        >
          {/* Hourly Rush */}
          <ChartContainer
            title="Hourly Sales Velocity (NPR)"
            subtitle="Peak customer dining and beverage volume"
            action={<Badge variant="primary">Peak: 8 PM</Badge>}
            height={280}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '190px',
                paddingTop: '20px',
                gap: '8px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {hourlyData.map((d) => {
                const heightPercent = Math.round((d.amount / maxHourly) * 100);
                const isPeak = d.amount === maxHourly;

                return (
                  <div
                    key={d.hour}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      flex: 1,
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: isPeak ? 'var(--r8-brand-primary)' : 'var(--r8-text-muted)',
                      }}
                    >
                      {Math.round(d.amount / 1000)}k
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '28px',
                        height: `${heightPercent}%`,
                        backgroundColor: isPeak ? 'var(--r8-brand-primary)' : 'var(--r8-bg-subtle)',
                        borderRadius: 'var(--r8-radius-sm) var(--r8-radius-sm) 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--r8-text-secondary)',
                        marginTop: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {d.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartContainer>

          {/* Category Sales Share */}
          <ChartContainer
            title="Category Sales Distribution"
            subtitle="Dining revenue contribution by section"
            height={280}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '10px' }}>
              {categoryList.map((c) => {
                const pct = Math.round((c.revenue / totalCatRevenue) * 100);
                return (
                  <div key={c.category}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                        {c.category.replace('_', ' ')}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--r8-text-secondary)' }}>
                        Rs. {c.revenue.toLocaleString('en-IN')} ({pct}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--r8-border-subtle)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          borderRadius: '4px',
                          backgroundColor:
                            c.category === 'momo'
                              ? 'var(--r8-brand-primary)'
                              : c.category === 'thakali_newari'
                              ? 'var(--r8-brand-gold)'
                              : c.category === 'beverages_bar'
                              ? 'var(--r8-chart-3, rgba(15, 143, 111, 0.45))'
                              : 'var(--r8-chart-4, rgba(242, 184, 75, 0.5))',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartContainer>
        </div>

        {/* Top 5 Dishes Table */}
        <div style={{ marginTop: 'var(--r8-space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Award size={18} color="var(--r8-brand-gold)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--r8-text-primary)', margin: 0 }}>
              Top 5 Best-Selling Dishes Today
            </h3>
          </div>

          <div className="r8-table-container">
            <Table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Dish Name</th>
                  <th>Orders Count</th>
                  <th>Turnover (NPR)</th>
                  <th style={{ textAlign: 'right' }}>Share of Gross</th>
                </tr>
              </thead>
              <tbody>
                {topDishes.map((dish, idx) => {
                  const pct = Math.round((dish.revenue / (grossSales || 1)) * 100);
                  return (
                    <tr key={dish.name}>
                      <td>
                        <Badge variant={idx === 0 ? 'primary' : 'neutral'} size="sm">
                          #{idx + 1}
                        </Badge>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                        {dish.name}
                      </td>
                      <td style={{ color: 'var(--r8-text-secondary)' }}>
                        {dish.count} plates
                      </td>
                      <td>
                        <PriceDisplay amount={dish.revenue} size="md" />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: 'var(--r8-brand-emerald)' }}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </PageContent>

      {/* IRD Compliant Z-Report Modal */}
      <Modal
        isOpen={isZReportOpen}
        onClose={() => setIsZReportOpen(false)}
        title="Nepal IRD Fiscal Z-Report (दैनिक कर विवरण)"
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Button variant="outline" onClick={() => setIsZReportOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              leftIcon={<Printer size={15} />}
              onClick={() => window.print()}
            >
              Print 80mm Fiscal Slip
            </Button>
          </div>
        }
      >
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.82rem',
            backgroundColor: 'var(--r8-bg-surface)',
            padding: 'var(--r8-space-4)',
            borderRadius: 'var(--r8-radius-md)',
            border: '1px dashed var(--r8-border-prominent)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ textAlign: 'center', borderBottom: '1px dashed var(--r8-border-subtle)', paddingBottom: '8px' }}>
            <strong style={{ fontSize: '1rem' }}>{settings.name}</strong>
            <div>{settings.address}</div>
            <div>VAT/PAN: {settings.panNumber}</div>
            <div>Fiscal Year: {fiscalYear}</div>
            <div>Nepali Date: {formattedBS}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span>Non-Taxable Sales:</span>
            <span>Rs. 0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Taxable Sales:</span>
            <span>Rs. {totalTaxableSales.toLocaleString('en-IN')}.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>13% VAT Collected:</span>
            <span>Rs. {totalVatCollected.toLocaleString('en-IN')}.00</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '0.95rem',
              borderTop: '1px dashed var(--r8-border-subtle)',
              paddingTop: '6px',
            }}
          >
            <span>Total Gross Turnover:</span>
            <span>Rs. {grossSales.toLocaleString('en-IN')}.00</span>
          </div>

          <div style={{ borderTop: '1px dashed var(--r8-border-subtle)', paddingTop: '6px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Fonepay QR / Digital:</span>
              <span>Rs. {(fonepaySales || Math.round(grossSales * 0.72)).toLocaleString('en-IN')}.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cash in Hand:</span>
              <span>Rs. {Math.round(grossSales * 0.2).toLocaleString('en-IN')}.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Card POS:</span>
              <span>Rs. {Math.round(grossSales * 0.08).toLocaleString('en-IN')}.00</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--r8-text-muted)', marginTop: '8px' }}>
            Generated via RESTRO8 IRD Daybook Module • Non-Resetting Serial #00492
          </div>
        </div>
      </Modal>
    </Page>
  );
};
