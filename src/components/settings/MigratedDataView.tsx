import React, { useState } from 'react';
import {
  Folder,
  ChevronLeft,
  Calendar,
  Upload,
  MoreHorizontal,
  FileSpreadsheet,
  X,
  Check,
  Download,
  Printer,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

type RegisterType =
  | 'overview'
  | 'sales-register'
  | 'sales-return-register'
  | 'purchase-register'
  | 'purchase-return-register';

interface SalesRow {
  id: string;
  sn: number;
  date: string;
  invoiceNo: string;
  buyerName: string;
  buyerPan: string;
  totalSales: number;
  exemptSales: number;
  taxableAmount: number;
  taxVat: number;
  exportAmount: number;
  exportCountry: string;
  exportDocNo: string;
  exportDate: string;
}

interface SalesReturnRow {
  id: string;
  sn: number;
  date: string;
  invoiceNo: string;
  buyerName: string;
  buyerPan: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  totalReturn: number;
  exemptReturn: number;
  taxableReturn: number;
  taxVat: number;
}

const NEPALI_MONTHS = [
  'Baisakh',
  'Jestha',
  'Ashadh',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

export const MigratedDataView: React.FC = () => {
  const { addToast } = useRestaurant();
  const [currentView, setCurrentView] = useState<RegisterType>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string>('Bhadra');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Seeded mock data stores or empty
  const [salesRows, setSalesRows] = useState<SalesRow[]>([]);
  const [salesReturnRows, setSalesReturnRows] = useState<SalesReturnRow[]>([]);

  const handleImportMockData = (type: RegisterType) => {
    if (type === 'sales-register') {
      setSalesRows([
        {
          id: 'sr-1',
          sn: 1,
          date: '2083-05-02',
          invoiceNo: 'INV-2083-001',
          buyerName: 'Himalayan Java Traders',
          buyerPan: '601239845',
          totalSales: 11300,
          exemptSales: 0,
          taxableAmount: 10000,
          taxVat: 1300,
          exportAmount: 0,
          exportCountry: '-',
          exportDocNo: '-',
          exportDate: '-',
        },
      ]);
      addToast('Data Imported', 'Imported 1 row into Sales Register.', 'success');
    } else if (type === 'sales-return-register') {
      setSalesReturnRows([
        {
          id: 'srr-1',
          sn: 1,
          date: '2083-05-10',
          invoiceNo: 'CN-2083-001',
          buyerName: 'Himalayan Java Traders',
          buyerPan: '601239845',
          itemDescription: 'Roasted Coffee Beans 1kg',
          quantity: 2,
          unit: 'Pkt',
          totalReturn: 2260,
          exemptReturn: 0,
          taxableReturn: 2000,
          taxVat: 260,
        },
      ]);
      addToast('Data Imported', 'Imported 1 row into Sales Return Register.', 'success');
    }
    setIsImportModalOpen(false);
  };

  // Main Overview Card matching Screenshot 1
  if (currentView === 'overview') {
    return (
      <div
        style={{
          padding: '24px 32px',
          backgroundColor: 'var(--color-background)',
          overflowY: 'auto',
          height: '100%',
          boxSizing: 'border-box',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            margin: '0 0 24px 0',
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          Migrated Data
        </h1>

        {/* Tax Report Card matching Screenshot 1 */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            maxWidth: '560px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          {/* Card Header with folder icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 20px',
              backgroundColor: '#F9FAFB',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4B5563',
              }}
            >
              <Folder size={15} />
            </div>
            <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
              Tax Report
            </span>
          </div>

          {/* 4 Register Links matching Screenshot 1 */}
          <div style={{ padding: '8px 0' }}>
            <RegisterLinkItem
              label="Sales Register"
              onClick={() => setCurrentView('sales-register')}
            />
            <RegisterLinkItem
              label="Sales Return Register"
              onClick={() => setCurrentView('sales-return-register')}
            />
            <RegisterLinkItem
              label="Purchase Register"
              onClick={() => setCurrentView('purchase-register')}
            />
            <RegisterLinkItem
              label="Purchase Return Register"
              onClick={() => setCurrentView('purchase-return-register')}
            />
          </div>
        </div>
      </div>
    );
  }

  // Sub-views: Sales Register, Sales Return Register, Purchase Register, Purchase Return Register
  const getRegisterTitle = () => {
    switch (currentView) {
      case 'sales-register':
        return 'Sales Register';
      case 'sales-return-register':
        return 'Sales Return Register';
      case 'purchase-register':
        return 'Purchase Register';
      case 'purchase-return-register':
        return 'Purchase Return Register';
      default:
        return '';
    }
  };

  const getEmptyStateText = () => {
    switch (currentView) {
      case 'sales-register':
        return 'No migrated sales register rows found';
      case 'sales-return-register':
        return 'No migrated sales return register rows found';
      case 'purchase-register':
        return 'No migrated purchase register rows found';
      case 'purchase-return-register':
        return 'No migrated purchase return register rows found';
      default:
        return 'No migrated rows found';
    }
  };

  return (
    <div
      style={{
        padding: '20px 28px',
        backgroundColor: 'var(--color-background)',
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header Bar matching Screenshots 2 and 4 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Back Button matching screenshots */}
          <button
            type="button"
            onClick={() => setCurrentView('overview')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: '0 0 2px 0',
                color: 'var(--color-foreground)',
              }}
            >
              {getRegisterTitle()}
            </h1>
            <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 500 }}>
              For the period of 2083-05-01 to 2083-05-31
            </div>
          </div>
        </div>

        {/* Right Controls matching screenshots: Date Pill, Import Button, Options (...) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          {/* Date Selector Pill */}
          <button
            type="button"
            onClick={() => setShowMonthDropdown((p) => !p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Calendar size={14} color="var(--color-muted-foreground)" />
            <span>This Month: {selectedMonth} ⌄</span>
          </button>

          {showMonthDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '38px',
                left: 0,
                backgroundColor: 'var(--color-card)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                padding: '6px',
                width: '160px',
                zIndex: 50,
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {NEPALI_MONTHS.map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setShowMonthDropdown(false);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    color: selectedMonth === m ? '#EF4444' : 'var(--color-foreground)',
                    fontWeight: selectedMonth === m ? 700 : 400,
                    backgroundColor: selectedMonth === m ? '#FEE2E2' : 'transparent',
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}

          {/* Import Button matching screenshots */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Upload size={14} color="var(--color-muted-foreground)" />
            <span>Import</span>
          </button>

          {/* Options Button (...) */}
          <button
            type="button"
            onClick={() => setShowOptionsDropdown((p) => !p)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <MoreHorizontal size={15} />
          </button>

          {showOptionsDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '38px',
                right: 0,
                backgroundColor: 'var(--color-card)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                padding: '6px',
                width: '180px',
                zIndex: 50,
              }}
            >
              <div
                onClick={() => {
                  addToast('Export', 'Exporting IRD Annex register to Excel...', 'info');
                  setShowOptionsDropdown(false);
                }}
                style={{
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Download size={14} />
                <span>Export to Excel</span>
              </div>
              <div
                onClick={() => {
                  window.print();
                  setShowOptionsDropdown(false);
                }}
                style={{
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Printer size={14} />
                <span>Print Register</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Statutory Table Container matching Screenshots 2, 3, 4, 5 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          {currentView === 'sales-register' && (
            <table style={{ width: '100%', minWidth: '1350px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                {/* Row 1 Header Categories matching Screenshots 2 & 3 */}
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                  <th rowSpan={2} style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '90px' }}>
                    मिति
                  </th>
                  <th colSpan={3} style={{ padding: '8px 14px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
                    बीजक
                  </th>
                  <th rowSpan={2} style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '130px' }}>
                    जम्मा बिक्री / निकासी (रू)
                  </th>
                  <th rowSpan={2} style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '150px' }}>
                    स्थानीय कर छुटको बिक्री मूल्य (रू)
                  </th>
                  <th colSpan={2} style={{ padding: '8px 14px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
                    करयोग्य बिक्री
                  </th>
                  <th colSpan={4} style={{ padding: '8px 14px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center' }}>
                    निकासी
                  </th>
                </tr>

                {/* Row 2 Sub-Headers matching Screenshots 2 & 3 */}
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '110px' }}>
                    बीजक नम्बर
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '160px' }}>
                    खरिदकर्ताको नाम
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '150px' }}>
                    खरिदकर्ताको स्थायी लेखा नम्बर
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '100px' }}>
                    मूल्य (रू)
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '100px' }}>
                    कर (रू)
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '150px' }}>
                    निकासी गरेको वस्तु वा सेवाको मूल्य (रू)
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '110px' }}>
                    निकासी गरेको देश
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '140px' }}>
                    निकासी प्रज्ञापनपत्र नम्बर
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, width: '130px' }}>
                    निकासी प्रज्ञापनपत्र मिति
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesRows.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{ padding: '80px 24px', textAlign: 'center' }}>
                      <FannedEmptyState title={getEmptyStateText()} subtitle={getEmptyStateText()} />
                    </td>
                  </tr>
                ) : (
                  salesRows.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '0.8rem' }}>
                      <td style={{ padding: '12px 14px' }}>{row.date}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{row.invoiceNo}</td>
                      <td style={{ padding: '12px 14px' }}>{row.buyerName}</td>
                      <td style={{ padding: '12px 14px' }}>{row.buyerPan}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.totalSales.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.exemptSales.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.taxableAmount.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.taxVat.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.exportAmount.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>{row.exportCountry}</td>
                      <td style={{ padding: '12px 14px' }}>{row.exportDocNo}</td>
                      <td style={{ padding: '12px 14px' }}>{row.exportDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {currentView === 'sales-return-register' && (
            <table style={{ width: '100%', minWidth: '1300px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                {/* Row 1 Header Categories matching Screenshots 4 & 5 */}
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                  <th rowSpan={2} style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '90px' }}>
                    मिति
                  </th>
                  <th colSpan={6} style={{ padding: '8px 14px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
                    बीजक
                  </th>
                  <th rowSpan={2} style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '130px' }}>
                    जम्मा फिर्ता (रू)
                  </th>
                  <th rowSpan={2} style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '160px' }}>
                    स्थानीय कर छुटको फिर्ता मूल्य (रू)
                  </th>
                  <th colSpan={2} style={{ padding: '8px 14px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center' }}>
                    करयोग्य फिर्ता
                  </th>
                </tr>

                {/* Row 2 Sub-Headers matching Screenshots 4 & 5 */}
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '110px' }}>
                    बीजक नम्बर
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '160px' }}>
                    खरिदकर्ताको नाम
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '150px' }}>
                    खरिदकर्ताको स्थायी लेखा नम्बर
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '150px' }}>
                    वस्तु वा सेवाको नाम
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '110px' }}>
                    वस्तु वा सेवाको परिमाण
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '110px' }}>
                    वस्तु वा सेवाको इकाई
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, borderRight: '1px solid var(--color-border)', width: '100px' }}>
                    मूल्य (रू)
                  </th>
                  <th style={{ padding: '8px 12px', fontSize: '0.76rem', fontWeight: 700, width: '100px' }}>
                    कर (रू)
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesReturnRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ padding: '80px 24px', textAlign: 'center' }}>
                      <FannedEmptyState title={getEmptyStateText()} subtitle={getEmptyStateText()} />
                    </td>
                  </tr>
                ) : (
                  salesReturnRows.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '0.8rem' }}>
                      <td style={{ padding: '12px 14px' }}>{row.date}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{row.invoiceNo}</td>
                      <td style={{ padding: '12px 14px' }}>{row.buyerName}</td>
                      <td style={{ padding: '12px 14px' }}>{row.buyerPan}</td>
                      <td style={{ padding: '12px 14px' }}>{row.itemDescription}</td>
                      <td style={{ padding: '12px 14px' }}>{row.quantity}</td>
                      <td style={{ padding: '12px 14px' }}>{row.unit}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.totalReturn.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.exemptReturn.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.taxableReturn.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>Rs {row.taxVat.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {(currentView === 'purchase-register' || currentView === 'purchase-return-register') && (
            <div style={{ padding: '80px 24px', textAlign: 'center' }}>
              <FannedEmptyState title={getEmptyStateText()} subtitle={getEmptyStateText()} />
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setIsImportModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              width: '460px',
              maxWidth: '90vw',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={20} color="var(--r8-brand-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                  Import Migrated {getRegisterTitle()}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', lineHeight: '1.4', marginBottom: '18px' }}>
              Upload your historical spreadsheet (.xlsx or .csv) formatted according to Inland Revenue Department (IRD) Nepal tax audit requirements.
            </p>

            {/* Dropzone */}
            <div
              onClick={() => handleImportMockData(currentView)}
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '10px',
                padding: '32px 16px',
                textAlign: 'center',
                backgroundColor: 'var(--color-background)',
                cursor: 'pointer',
                marginBottom: '20px',
              }}
            >
              <Upload size={28} color="#9CA3AF" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                Click to browse or drop file here
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>
                Supports .XLSX, .CSV files up to 10MB
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleImportMockData(currentView)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--r8-brand-primary)',
                  color: '#FFF',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Load Sample Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface RegisterLinkItemProps {
  label: string;
  onClick: () => void;
}

const RegisterLinkItem: React.FC<RegisterLinkItemProps> = ({ label, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 20px',
        fontSize: '0.92rem',
        fontWeight: 600,
        color: 'var(--color-foreground)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <span>{label}</span>
      <span style={{ color: '#9CA3AF', fontSize: '0.84rem' }}>›</span>
    </div>
  );
};

interface FannedEmptyStateProps {
  title: string;
  subtitle: string;
}

const FannedEmptyState: React.FC<FannedEmptyStateProps> = ({ title, subtitle }) => {
  return (
    <div>
      {/* Fanned Documents Circular Illustration matching Screenshots 2 & 4 */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '32px',
            borderRadius: '3px',
            backgroundColor: '#10B981',
            position: 'absolute',
            transform: 'rotate(-15deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
        <div
          style={{
            width: '24px',
            height: '32px',
            borderRadius: '3px',
            backgroundColor: '#3B82F6',
            position: 'absolute',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
        <div
          style={{
            width: '24px',
            height: '32px',
            borderRadius: '3px',
            backgroundColor: '#8B5CF6',
            position: 'absolute',
            transform: 'rotate(15deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
      </div>

      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
        {subtitle}
      </div>
    </div>
  );
};
