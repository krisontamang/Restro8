import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Search,
  Plus,
  MoreHorizontal,
  Zap,
  Network,
  Cloud,
  RefreshCw,
  WifiOff,
  ExternalLink,
  Info,
  Play,
  FileText,
  X,
  ChevronDown,
  Monitor,
  SlidersHorizontal,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export interface PrinterItem {
  id: string;
  sn: number;
  name: string;
  connection: string;
  size: '80mm' | '58mm';
  autoPrintBill: boolean;
  autoPrintFullKot: boolean;
  autoPrintOrderSlip: boolean;
  printServer: string;
  cloudPrinting: boolean;
  status: 'connected' | 'offline';
}

export const PrintersView: React.FC = () => {
  const { addToast } = useRestaurant();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Printing Mode: 'local' | 'cloud'
  const [printingMode, setPrintingMode] = useState<'local' | 'cloud'>('local');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);

  // Popover States for Card 2 & Card 3 (Screenshots 2 & 3)
  const [showDirectPrintStatus, setShowDirectPrintStatus] = useState(false);
  const [showLocalModeInsights, setShowLocalModeInsights] = useState(false);

  // Printers List State
  const [printers, setPrinters] = useState<PrinterItem[]>([]);

  // Add New Printer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPrinterName, setNewPrinterName] = useState('');
  const [newConnection, setNewConnection] = useState('Network (192.168.1.100)');
  const [newSize, setNewSize] = useState<'80mm' | '58mm'>('80mm');
  const [newAutoBill, setNewAutoBill] = useState(true);
  const [newAutoKot, setNewAutoKot] = useState(true);
  const [newAutoOrderSlip, setNewAutoOrderSlip] = useState(true);
  const [newCloudPrinting, setNewCloudPrinting] = useState(false);

  // Keyboard shortcut listener for 'N'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setIsAddModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTestAllPrinters = () => {
    addToast('Test Print', 'Sending diagnostic test receipt to all configured thermal printers...', 'info');
  };

  const handleSavePrinter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrinterName.trim()) {
      addToast('Validation', 'Printer Name is required.', 'error');
      return;
    }

    const newItem: PrinterItem = {
      id: `printer-${Date.now()}`,
      sn: printers.length + 1,
      name: newPrinterName.trim(),
      connection: newConnection,
      size: newSize,
      autoPrintBill: newAutoBill,
      autoPrintFullKot: newAutoKot,
      autoPrintOrderSlip: newAutoOrderSlip,
      printServer: printingMode === 'local' ? 'Local QZ Tray' : 'RESTRO8 Cloud Agent',
      cloudPrinting: newCloudPrinting,
      status: 'connected',
    };

    setPrinters((prev) => [...prev, newItem]);
    setNewPrinterName('');
    setIsAddModalOpen(false);
    addToast('Success', `Printer "${newItem.name}" added successfully.`, 'success');
  };

  const filteredPrinters = printers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.connection.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Top Header matching Screenshot 1 */}
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
          Printers
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 12px 7px 30px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontSize: '0.82rem',
                outline: 'none',
                width: '180px',
              }}
            />
          </div>

          {/* Test All Printers Button */}
          <button
            type="button"
            onClick={handleTestAllPrinters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Printer size={14} />
            <span>Test All Printers</span>
          </button>

          {/* + Add New [N] button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--r8-brand-primary)',
              color: '#FFFFFF',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            <span>Add New</span>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              N
            </span>
          </button>

          {/* Options Button */}
          <button
            type="button"
            onClick={() => addToast('Printers', 'Printer table column settings.', 'info')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              cursor: 'pointer',
            }}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* 3 Status / KPI Cards Grid matching Screenshot 1 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 2fr 2fr',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Card 1: Total Printers */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#CCFBF1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Printer size={15} color="#0D9488" />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Total Printers
            </span>
          </div>

          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            {printers.length}/10
          </div>

          {/* Faded Watermark Printer Icon */}
          <Printer
            size={42}
            color="#E5E7EB"
            style={{
              position: 'absolute',
              right: '16px',
              bottom: '12px',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Card 2: Direct Printing matching Screenshot 1 & 2 */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 20px',
            position: 'relative',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={15} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Direct Printing
              </span>
            </div>

            {/* Disconnected Pill matching Screenshot 1 */}
            <div
              onClick={() => setShowDirectPrintStatus((p) => !p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: '#F3F4F6',
                border: '1px solid #E5E7EB',
                fontSize: '0.74rem',
                color: '#6B7280',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <WifiOff size={12} color="#6B7280" />
              <span>Disconnected</span>
              <RefreshCw size={11} color="#6B7280" />
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: '1.4', marginBottom: '6px' }}>
            Direct printing is not currently available. Setup might be required.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a
              href="#setup-docs"
              onClick={(e) => {
                e.preventDefault();
                setShowDirectPrintStatus(true);
              }}
              style={{
                fontSize: '0.78rem',
                color: '#2563EB',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Read docs for setup</span>
              <ExternalLink size={12} />
            </a>

            <button
              type="button"
              onClick={() => setShowDirectPrintStatus((p) => !p)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#9CA3AF',
                padding: '2px',
              }}
            >
              <Info size={14} />
            </button>
          </div>

          {/* Popover matching Screenshot 2 */}
          {showDirectPrintStatus && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '20px',
                marginTop: '8px',
                width: '320px',
                backgroundColor: 'var(--color-card)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                padding: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 50,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={14} color="#FFF" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-foreground)' }}>
                      Direct Printing Status
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>Detailed insights</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDirectPrintStatus(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <X size={14} color="#9CA3AF" />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#4B5563', lineHeight: '1.4', marginBottom: '12px' }}>
                Direct printing is currently offline. Please ensure the RESTRO8 Print Agent is running on your local machine.
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                    <FileText size={12} />
                    <span>Download these files for setup</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToast('Video Tutorial', 'Opening RESTRO8 thermal printer setup guide.', 'info')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: '#DC2626',
                      cursor: 'pointer',
                    }}
                  >
                    <Play size={10} fill="#DC2626" />
                    <span>Watch tutorial</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem' }}>
                  <a
                    href="#download-qz"
                    onClick={(e) => {
                      e.preventDefault();
                      addToast('Download', 'Downloading QZ Tray v2.2.4 installer...', 'success');
                    }}
                    style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Download Qz Tray
                  </a>
                  <a
                    href="#download-override"
                    onClick={(e) => {
                      e.preventDefault();
                      addToast('Download', 'Downloading Override.crt SSL certificate...', 'success');
                    }}
                    style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Download Override.crt
                  </a>
                </div>
              </div>

              <div style={{ fontSize: '0.74rem', color: '#6B7280', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                Connected Printers: <strong>0 / {printers.length}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Printing Mode matching Screenshot 1, 3, 4 */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 20px',
            position: 'relative',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Printer size={15} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Printing Mode
              </span>
            </div>

            {/* Mode Select Button matching Screenshot 1 & 4 */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsModeDropdownOpen((p) => !p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--color-foreground)',
                  cursor: 'pointer',
                }}
              >
                {printingMode === 'local' ? (
                  <Network size={14} color="#4B5563" />
                ) : (
                  <Cloud size={14} color="#2563EB" />
                )}
                <span>{printingMode === 'local' ? 'Local' : 'Cloud'}</span>
                <ChevronDown size={14} color="#9CA3AF" />
              </button>

              {/* Mode Dropdown Menu matching Screenshot 4 */}
              {isModeDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    width: '130px',
                    zIndex: 60,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    onClick={() => {
                      setPrintingMode('local');
                      setIsModeDropdownOpen(false);
                      addToast('Printing Mode', 'Switched to Local Network QZ Tray mode.', 'info');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: printingMode === 'local' ? '#FEE2E2' : 'transparent',
                      color: printingMode === 'local' ? 'var(--r8-brand-primary)' : 'var(--color-foreground)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Network size={14} color={printingMode === 'local' ? 'var(--r8-brand-primary)' : '#6B7280'} />
                    <span>Local</span>
                  </div>

                  <div
                    onClick={() => {
                      setPrintingMode('cloud');
                      setIsModeDropdownOpen(false);
                      addToast('Printing Mode', 'Switched to Cloud Agent mode.', 'info');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: printingMode === 'cloud' ? '#FEE2E2' : 'transparent',
                      color: printingMode === 'cloud' ? 'var(--r8-brand-primary)' : 'var(--color-foreground)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Cloud size={14} color={printingMode === 'cloud' ? 'var(--r8-brand-primary)' : '#6B7280'} />
                    <span>Cloud</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: '1.4', marginBottom: '6px' }}>
            {printingMode === 'local'
              ? 'Printers are connected directly over your local network via QZ Tray.'
              : 'Printers receive cloud dispatch events through the RESTRO8 Webhook Print Server.'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowLocalModeInsights((p) => !p)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#9CA3AF',
                padding: '2px',
              }}
            >
              <Info size={14} />
            </button>
          </div>

          {/* Local Mode Popover matching Screenshot 3 */}
          {showLocalModeInsights && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: '20px',
                marginTop: '8px',
                width: '280px',
                backgroundColor: 'var(--color-card)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                padding: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 50,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Printer size={14} color="#FFF" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-foreground)' }}>
                      Local Mode
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>Detailed insights</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLocalModeInsights(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <X size={14} color="#9CA3AF" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#4B5563' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Network size={14} color="#6B7280" />
                  <span>LAN only</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Monitor size={14} color="#6B7280" />
                  <span>Low latency, high reliability</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={14} color="#6B7280" />
                  <span>Requires QZ Tray on this machine</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Table Area matching Screenshot 1 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              minWidth: '1000px',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.84rem',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-muted, #F9FAFB)',
                  color: 'var(--color-foreground)',
                }}
              >
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>SN</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Printer Name</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Connection</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Size</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Print</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Auto Print Bill</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Auto Print Full Kot</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Auto Print Order Slip</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Print Servers</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cloud Printing</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrinters.length > 0 ? (
                filteredPrinters.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <td style={{ padding: '14px 16px', color: '#6B7280' }}>{row.sn}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-foreground)' }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#4B5563' }}>{row.connection}</td>
                    <td style={{ padding: '14px 16px', color: '#4B5563' }}>{row.size}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        type="button"
                        onClick={() => addToast('Test Print', `Test print sent to ${row.name}`, 'success')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-card)',
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                        }}
                      >
                        Test
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <input type="checkbox" checked={row.autoPrintBill} readOnly />
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <input type="checkbox" checked={row.autoPrintFullKot} readOnly />
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <input type="checkbox" checked={row.autoPrintOrderSlip} readOnly />
                    </td>
                    <td style={{ padding: '14px 16px', color: '#4B5563' }}>{row.printServer}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <input type="checkbox" checked={row.cloudPrinting} readOnly />
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State matching Screenshot 1 */
                <tr>
                  <td colSpan={10} style={{ padding: '64px 20px', textAlign: 'center' }}>
                    {/* Fanned Documents Graphic */}
                    <div
                      style={{
                        position: 'relative',
                        width: '90px',
                        height: '90px',
                        margin: '0 auto 16px auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: '90px',
                          height: '90px',
                          borderRadius: '50%',
                          backgroundColor: '#F3F4F6',
                          zIndex: 0,
                        }}
                      />
                      <svg width="56" height="56" viewBox="0 0 60 60" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                        <rect x="8" y="14" width="26" height="34" rx="4" transform="rotate(-15 8 14)" fill="#10B981" />
                        <line x1="14" y1="22" x2="26" y2="19" stroke="#FFF" strokeWidth="2" strokeLinecap="round" transform="rotate(-15 8 14)" />
                        <line x1="14" y1="28" x2="24" y2="25" stroke="#FFF" strokeWidth="2" strokeLinecap="round" transform="rotate(-15 8 14)" />

                        <rect x="26" y="8" width="26" height="34" rx="4" transform="rotate(15 26 8)" fill="#8B5CF6" />
                        <line x1="32" y1="16" x2="44" y2="19" stroke="#FFF" strokeWidth="2" strokeLinecap="round" transform="rotate(15 26 8)" />

                        <rect x="17" y="13" width="26" height="35" rx="4" fill="#3B82F6" />
                        <line x1="22" y1="20" x2="38" y2="20" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                        <line x1="22" y1="25" x2="38" y2="25" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                        <line x1="22" y1="30" x2="32" y2="30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                        <line x1="22" y1="35" x2="35" y2="35" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                      No Printer found
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: '18px' }}>
                      Create a new printer or import a new data.
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: 'var(--r8-brand-primary)',
                        color: '#FFFFFF',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + Add New Printer
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer matching Screenshot 1 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.8rem',
            color: '#6B7280',
          }}
        >
          <div>
            {selectedIds.length} of {filteredPrinters.length} row(s) selected.
          </div>
        </div>
      </div>

      {/* Add New Printer Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              padding: '24px',
              width: '460px',
              maxWidth: '90vw',
              border: '1px solid var(--color-border)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Add New Thermal Printer</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={18} color="#9CA3AF" />
              </button>
            </div>

            <form onSubmit={handleSavePrinter}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Printer Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kitchen ESC/POS 80mm, Bar Thermal"
                  value={newPrinterName}
                  onChange={(e) => setNewPrinterName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                    Connection
                  </label>
                  <select
                    value={newConnection}
                    onChange={(e) => setNewConnection(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Network (192.168.1.100)">Network / Ethernet</option>
                    <option value="USB (QZ Tray)">USB (QZ Tray)</option>
                    <option value="Bluetooth (ESC/POS)">Bluetooth POS</option>
                    <option value="Cloud Relay Agent">Cloud Relay Agent</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                    Paper Size
                  </label>
                  <select
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value as '80mm' | '58mm')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="80mm">80mm (Standard Receipt)</option>
                    <option value="58mm">58mm (Small Ticket)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', padding: '12px', backgroundColor: 'var(--color-background)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Automatic Print Triggers:</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newAutoBill} onChange={(e) => setNewAutoBill(e.target.checked)} />
                  <span>Auto Print Bill / Invoice</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newAutoKot} onChange={(e) => setNewAutoKot(e.target.checked)} />
                  <span>Auto Print Full KOT Ticket</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newAutoOrderSlip} onChange={(e) => setNewAutoOrderSlip(e.target.checked)} />
                  <span>Auto Print Order Slip</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newCloudPrinting} onChange={(e) => setNewCloudPrinting(e.target.checked)} />
                  <span>Enable Cloud Printing Relay</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFF',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Printer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
