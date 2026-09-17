import React, { useState } from 'react';
import { Copy, ExternalLink, Check, Store, Settings2 } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Modal } from '../ui/Modal';
import { getPublicMenuUrl, publicMenuStatus } from '../../utils/publicMenu';

interface RestaurantSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RestaurantSwitcherModal: React.FC<RestaurantSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { settings, addToast, setActiveTab } = useRestaurant();
  const [copied, setCopied] = useState(false);
  const restaurantName = settings.name.trim() || 'Your restaurant';
  const menuUrl = getPublicMenuUrl();

  const copyMenuUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      addToast('Menu preview link copied', publicMenuStatus(), 'success');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      addToast('Copy unavailable', 'Select the menu URL and copy it manually.', 'warning');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Workspace" description="The active restaurant comes from this device workspace." size="sm" footer={(
      <>
        <button type="button" className="r8-button r8-button-secondary" onClick={onClose}>Close</button>
        <button type="button" className="r8-button r8-button-primary" onClick={() => { setActiveTab('settings-restaurant'); onClose(); }}>
          <Settings2 size={16} aria-hidden="true" /> Restaurant settings
        </button>
      </>
    )}>
      <div style={{ display: 'grid', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14, border: '1px solid var(--r8-border-subtle)', borderRadius: 12 }}>
          <span style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 10, background: 'var(--r8-bg-subtle)', color: 'var(--r8-brand-primary)' }}>
            <Store size={20} aria-hidden="true" />
          </span>
          <div style={{ minWidth: 0 }}>
            <strong style={{ display: 'block', overflowWrap: 'anywhere' }}>{restaurantName}</strong>
            <span style={{ color: 'var(--r8-text-secondary)', fontSize: 13 }}>{settings.city || settings.address || 'Add a location in settings'}</span>
          </div>
        </div>
        <div>
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Guest menu preview</p>
          <p style={{ margin: '0 0 10px', color: 'var(--r8-text-secondary)', fontSize: 13 }}>{publicMenuStatus()}</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <code style={{ flex: 1, minWidth: 0, padding: '11px 12px', border: '1px solid var(--r8-border-subtle)', borderRadius: 8, overflowWrap: 'anywhere', fontSize: 12 }}>{menuUrl}</code>
            <button type="button" className="r8-button r8-button-secondary" onClick={copyMenuUrl} aria-label="Copy guest menu preview URL">
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            </button>
            <a className="r8-button r8-button-secondary" href={menuUrl} target="_blank" rel="noreferrer" aria-label="Open guest menu preview">
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <p style={{ margin: 0, padding: 12, borderRadius: 8, background: 'var(--r8-bg-subtle)', color: 'var(--r8-text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
          Branch switching and cloud sharing are not connected in this local build. This view only reflects the active local workspace.
        </p>
      </div>
    </Modal>
  );
};
