import React, { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Link as LinkIcon,
  Printer,
  QrCode,
  Search,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { BrandLogo } from '../brand/BrandLogo';
import { printDocument } from '../../lib/printDocument';
import { getPublicMenuUrl } from '../../utils/publicMenu';
import type { Table } from '../../types/restaurant';

interface QRCodeCardData {
  id: string;
  name: string;
  zone: string;
  url: string;
}

const qrOptions = {
  errorCorrectionLevel: 'H' as const,
  margin: 2,
  width: 420,
  color: { dark: '#101c18', light: '#ffffff' },
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] || character);
}

function QRCanvas({ value, label }: { value: string; label: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setError(false);
    QRCode.toCanvas(canvas, value, { ...qrOptions, width: 216 }).catch(() => setError(true));
  }, [value]);

  return error ? (
    <div className="qr-code-error" role="img" aria-label={`Unable to generate QR code for ${label}`}>
      <QrCode size={44} aria-hidden="true" />
      <span>QR unavailable</span>
    </div>
  ) : (
    <canvas ref={canvasRef} className="qr-code-canvas" aria-label={`QR code for ${label}`} role="img" />
  );
}

export const QRCodesView: React.FC = () => {
  const { settings, tables } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const qrCards = useMemo<QRCodeCardData[]>(() => tables.map((table: Table) => ({
    id: table.id,
    name: table.label,
    zone: table.zone,
    url: getPublicMenuUrl(table.id),
  })), [tables]);

  const filteredCards = qrCards.filter((card) =>
    `${card.name} ${card.zone}`.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const copyToClipboard = async (card: QRCodeCardData) => {
    try {
      await navigator.clipboard.writeText(card.url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = card.url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (!copied) { setNotice('Copy is unavailable. Open the menu and copy its address.'); return; }
    }
    setCopiedId(card.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const downloadQr = async (card: QRCodeCardData) => {
    setBusyId(card.id);
    try {
      const dataUrl = await QRCode.toDataURL(card.url, qrOptions);
      downloadDataUrl(dataUrl, `restro8-${card.id}-menu-qr.png`);
      setNotice(`${card.name} QR downloaded as a PNG.`);
    } catch {
      setNotice('The QR code could not be generated. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const printQr = async (cards: QRCodeCardData[]) => {
    setBusyId('print');
    try {
      const images = await Promise.all(cards.map(async (card) => ({
        ...card,
        dataUrl: await QRCode.toDataURL(card.url, qrOptions),
      })));
      const cardsHtml = images.map((card) => `
        <article class="stand">
          <p class="eyebrow">EXPLORE THE MENU</p>
          <h1>${escapeHtml(settings.name || 'Restaurant')}</h1>
          <div class="table-name">${escapeHtml(card.name)}</div>
          <img src="${card.dataUrl}" alt="QR code for ${escapeHtml(card.name)}" />
          <p class="instruction">Scan to explore our menu</p>
          <p class="url">${escapeHtml(card.url)}</p>
          <p class="powered">RESTRO8 · INFINITE HOSPITALITY</p>
        </article>`).join('');
      const sheet = document.createElement('main');
      sheet.className = 'qr-print-sheet';
      sheet.innerHTML = cardsHtml;
      await printDocument(sheet, 'Restro8 menu QR codes', 'a4');
      setNotice(`${cards.length} QR stand${cards.length === 1 ? '' : 's'} ready to print.`);
    } catch {
      setNotice('The QR stands could not be prepared for printing.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="qr-codes-view">
      <section className="qr-hero">
        <div>
          <p className="eyebrow">Guest experience</p>
          <h1>Menu QR codes</h1>
          <p>Every table gets a real, scannable link to the Restro8 guest menu.</p>
        </div>
        <div className="qr-hero-brand"><BrandLogo /></div>
      </section>

      {notice && (
        <div className="qr-notice" role="status">
          <Check size={16} aria-hidden="true" />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss QR notification">Dismiss</button>
        </div>
      )}

      <section className="qr-toolbar" aria-label="QR code controls">
        <label className="qr-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search tables</span>
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search tables or zones" />
        </label>
        <div className="qr-toolbar-actions">
          <button type="button" className="secondary-button" onClick={() => printQr(filteredCards)} disabled={!filteredCards.length || busyId === 'print'}>
            <Printer size={16} aria-hidden="true" /> {busyId === 'print' ? 'Preparing…' : 'Print all'}
          </button>
          <span className="qr-count">{filteredCards.length} of {qrCards.length} tables</span>
        </div>
      </section>

      {filteredCards.length === 0 ? (
        <div className="qr-empty"><QrCode size={32} aria-hidden="true" /><h2>No tables found</h2><p>Try a different table name or zone.</p></div>
      ) : (
        <section className="qr-card-grid" aria-label="Table QR codes">
          {filteredCards.map((card) => (
            <article className="qr-card" key={card.id}>
              <div className="qr-card-header">
                <div>
                  <p className="eyebrow">{card.zone}</p>
                  <h2>{card.name}</h2>
                </div>
                <span className="qr-live"><Sparkles size={13} aria-hidden="true" /> Live link</span>
              </div>
              <div className="qr-artwork"><QRCanvas value={card.url} label={card.name} /></div>
              <p className="qr-helper">Guests scan this code to open the menu for {card.name}.</p>
              <div className="qr-url" title={card.url}>{card.url}</div>
              <div className="qr-card-actions">
                <button type="button" className="secondary-button" onClick={() => copyToClipboard(card)}>
                  {copiedId === card.id ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  {copiedId === card.id ? 'Copied' : 'Copy link'}
                </button>
                <button type="button" className="secondary-button" onClick={() => downloadQr(card)} disabled={busyId === card.id}>
                  <Download size={15} aria-hidden="true" /> {busyId === card.id ? 'Saving…' : 'PNG'}
                </button>
                <a className="icon-button" href={card.url} target="_blank" rel="noreferrer" aria-label={`Open guest menu for ${card.name}`}>
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </section>
      )}

      <p className="qr-footnote"><LinkIcon size={14} aria-hidden="true" /> Set <code>VITE_PUBLIC_MENU_URL</code> before production so printed codes point to your public menu domain.</p>
    </div>
  );
};
