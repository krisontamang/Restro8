import React, { useState } from 'react';
import { SlidersHorizontal, MoreHorizontal, Search, Check, RefreshCw, Download } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export interface ActivityLogItem {
  id: string;
  sn: number;
  date: string;
  title: string;
  type: string;
  description: string;
  highlightWords?: string[];
  performedBy: string;
}

const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    sn: 1,
    date: '14 Sep 2026, 02:26 PM',
    title: 'Order created',
    type: 'Order Created',
    description: 'Kirtiman Tamang created Table order for Cabin 1.',
    highlightWords: ['Kirtiman Tamang', 'Cabin 1'],
    performedBy: 'Kirtiman Tamang',
  },
  {
    id: 'log-2',
    sn: 2,
    date: '14 Sep 2026, 02:15 PM',
    title: 'Restaurant created',
    type: 'Restaurant Created',
    description: 'Sample event: restaurant workspace created',
    highlightWords: [],
    performedBy: 'Kirtiman Tamang',
  },
];

export const ActivityLogView: React.FC = () => {
  const { addToast, auditLogs } = useRestaurant();
  const [persistedLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('restrox_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LOGS;
  });

  // Convert live audit logs from RestaurantContext into ActivityLogItem
  const liveAuditItems: ActivityLogItem[] = (auditLogs || []).map((entry, idx) => {
    let typeName = 'System Audit';
    if (entry.action === 'shift_open') typeName = 'Shift Opened';
    else if (entry.action === 'shift_close') typeName = 'Shift Closed';
    else if (entry.action === 'table_transfer') typeName = 'Table Transferred';
    else if (entry.action === 'bill_settled') typeName = 'Payment Settled';
    else if (entry.action === 'order_created') typeName = 'Order Created';

    return {
      id: entry.id,
      sn: idx + 1,
      date: new Date(entry.timestamp).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      title: entry.action.replace(/_/g, ' ').toUpperCase(),
      type: typeName,
      description: `${entry.actorName}: ${entry.details}`,
      highlightWords: [entry.actorName, entry.targetType, 'Rs.'],
      performedBy: entry.actorName,
    };
  });

  const logs: ActivityLogItem[] = [...liveAuditItems, ...persistedLogs];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLogs.map((l) => l.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleExport = () => {
    addToast('Activity Log Exported', 'CSV report downloaded.', 'success');
    setShowOptionsDropdown(false);
  };

  const renderHighlightedText = (text: string, highlights?: string[]) => {
    if (!highlights || highlights.length === 0) return <span>{text}</span>;

    // Split and highlight words
    const regex = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          highlights.includes(part) ? (
            <strong key={index} style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

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
      {/* Top Header matching Screenshot 2 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            margin: 0,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          Activity Log
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          {/* Filter button matching Screenshot 2 */}
          <button
            type="button"
            onClick={() => setShowFilterDropdown((p) => !p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: showFilterDropdown ? '#F3F4F6' : 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={14} style={{ color: 'var(--color-muted-foreground)' }} />
            <span>Filter</span>
          </button>

          {/* Options button (...) matching Screenshot 2 */}
          <button
            type="button"
            onClick={() => setShowOptionsDropdown((p) => !p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: showOptionsDropdown ? '#F3F4F6' : 'var(--color-card)',
              color: 'var(--color-foreground)',
              cursor: 'pointer',
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Filter Dropdown */}
          {showFilterDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '44px',
                backgroundColor: 'var(--color-card)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                padding: '12px',
                width: '220px',
                zIndex: 50,
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted-foreground)', marginBottom: '8px' }}>
                Filter by Type
              </div>
              {['All', 'Order Created', 'Payment Settled', 'Shift Opened', 'Shift Closed', 'Table Transferred', 'Bill Voided', 'Discount Applied'].map((t) => (
                <div
                  key={t}
                  onClick={() => {
                    setFilterType(t);
                    setShowFilterDropdown(false);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: filterType === t ? '#FEE2E2' : 'transparent',
                    color: filterType === t ? '#EF4444' : 'var(--color-foreground)',
                    fontWeight: filterType === t ? 600 : 400,
                  }}
                >
                  <span>{t}</span>
                  {filterType === t && <Check size={14} />}
                </div>
              ))}
            </div>
          )}

          {/* Options Dropdown */}
          {showOptionsDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                backgroundColor: 'var(--color-card)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                padding: '8px',
                width: '180px',
                zIndex: 50,
              }}
            >
              <button
                type="button"
                onClick={handleExport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--color-foreground)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Table Container matching Screenshot 2 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                <th style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)', width: '60px' }}>
                  SN
                </th>
                <th style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)', width: '180px' }}>
                  Date
                </th>
                <th style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)', width: '160px' }}>
                  Title
                </th>
                <th style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)', width: '160px' }}>
                  Type
                </th>
                <th style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                  Description
                </th>
                <th style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)', width: '160px' }}>
                  Performed By
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isSelected = selectedIds.includes(log.id);
                return (
                  <tr
                    key={log.id}
                    onClick={() => toggleSelectRow(log.id)}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? '#FEF2F2' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '16px', fontSize: '0.84rem', color: 'var(--color-foreground)', fontWeight: 500 }}>
                      {log.sn}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.84rem', color: 'var(--color-foreground)' }}>
                      {log.date}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.84rem', color: 'var(--color-foreground)' }}>
                      {log.title}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.84rem', color: 'var(--color-foreground)' }}>
                      {log.type}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.84rem', color: 'var(--color-foreground)' }}>
                      {renderHighlightedText(log.description, log.highlightWords)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.84rem', color: 'var(--color-foreground)' }}>
                      {log.performedBy}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted-foreground)' }}>
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer matching Screenshot 2: "0 of 2 row(s) selected." */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '0.82rem',
          color: 'var(--color-muted-foreground)',
        }}
      >
        {selectedIds.length} of {filteredLogs.length} row(s) selected.
      </div>
    </div>
  );
};
