import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { getPublicMenuUrl, publicMenuStatus } from '../../utils/publicMenu';
import {
  Copy,
  QrCode,
  MapPin,
  Plus,
  Check,
  Globe,
  Trash2,
  X,
  Droplet,
} from 'lucide-react';

interface LinkItem {
  id: string;
  platform: string;
  url: string;
}

interface MenuImageFile {
  id: string;
  name: string;
  previewUrl: string;
  size: string;
}

export const RestroLinkView: React.FC = () => {
  const { settings, addToast } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'restrolink' | 'menu_images' | 'appearance'>('appearance');
  const [copiedRestroLink, setCopiedRestroLink] = useState(false);
  const [copiedMenuLink, setCopiedMenuLink] = useState(false);

  // Tab 1: RestroLink States
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [shareMenuEnabled, setShareMenuEnabled] = useState(true);
  const [phoneEnabled, setPhoneEnabled] = useState(true);
  const [selectedAddress] = useState(settings.address || settings.city || '');
  const [socialLinks, setSocialLinks] = useState<LinkItem[]>([
    { id: '1', platform: 'Instagram', url: '' },
    { id: '2', platform: 'Facebook', url: '' },
  ]);
  const [usefulLinks, setUsefulLinks] = useState<LinkItem[]>([
    { id: '1', platform: 'Google Maps', url: '' },
  ]);
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [showAddUseful, setShowAddUseful] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Tab 2: Menu Images States
  const [uploadedMenuImages, setUploadedMenuImages] = useState<MenuImageFile[]>([]);

  // Tab 3: Appearance States
  const [heading, setHeading] = useState(settings.name || 'Your restaurant');
  const [bio, setBio] = useState(settings.tagline || 'Add a short description for your guest menu.');
  const [footerMsg, setFooterMsg] = useState('Thank you for visiting.');
  const [selectedLayout, setSelectedLayout] = useState<'grid' | 'list'>('grid');
  const [selectedPalette, setSelectedPalette] = useState('light');
  const customBg = '#FFFFFF';
  const customCard = '#F3F4F6';
  const customCardText = '#000000';
  const customText = '#000000';

  const restroLinkUrl = getPublicMenuUrl();
  const menuLinkUrl = getPublicMenuUrl();

  const handleCopyRestroLink = () => {
    navigator.clipboard?.writeText(restroLinkUrl);
    setCopiedRestroLink(true);
    addToast('Menu preview link copied', publicMenuStatus(), 'success');
    setTimeout(() => setCopiedRestroLink(false), 2000);
  };

  const handleCopyMenuLink = () => {
    navigator.clipboard?.writeText(menuLinkUrl);
    setCopiedMenuLink(true);
    addToast('Menu preview link copied', publicMenuStatus(), 'success');
    setTimeout(() => setCopiedMenuLink(false), 2000);
  };

  const handleAddMenuImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImg: MenuImageFile = {
        id: Date.now().toString(),
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      };
      setUploadedMenuImages((prev) => [...prev, newImg]);
      addToast('Menu Uploaded', `Added ${file.name}`, 'success');
    }
  };

  const handleAddSocialLink = () => {
    if (!newPlatform.trim() || !newUrl.trim()) return;
    setSocialLinks((prev) => [
      ...prev,
      { id: Date.now().toString(), platform: newPlatform.trim(), url: newUrl.trim() },
    ]);
    setShowAddSocial(false);
    setNewPlatform('');
    setNewUrl('');
    addToast('Social Link Added', 'Added new social link.', 'success');
  };

  const handleAddUsefulLink = () => {
    if (!newPlatform.trim() || !newUrl.trim()) return;
    setUsefulLinks((prev) => [
      ...prev,
      { id: Date.now().toString(), platform: newPlatform.trim(), url: newUrl.trim() },
    ]);
    setShowAddUseful(false);
    setNewPlatform('');
    setNewUrl('');
    addToast('Useful Link Added', 'Added new useful link.', 'success');
  };

  return (
    <div style={{ padding: '28px 36px', maxWidth: '980px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Page Title matching Screenshot 3 */}
      <h1
        style={{
          fontSize: '1.65rem',
          fontWeight: 900,
          color: 'var(--color-foreground, #0F172A)',
          letterSpacing: '-0.5px',
          marginBottom: '16px',
        }}
      >
        Website
      </h1>

      {/* Top Tabs Pill Bar matching Screenshots 1, 2, 3 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--color-muted, #F8FAFC)',
          padding: '4px',
          borderRadius: '10px',
          width: 'fit-content',
          border: '1px solid var(--color-border)',
          marginBottom: '26px',
        }}
      >
        {[
          { id: 'restrolink', label: 'RestroLink' },
          { id: 'menu_images', label: 'Menu Images' },
          { id: 'appearance', label: 'Appearance' },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '7px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isSelected ? 'var(--r8-brand-primary)' : 'transparent',
                color: isSelected ? '#FFFFFF' : 'var(--color-foreground)',
                fontSize: '0.86rem',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================
          TAB 1: RestroLink (Matching Screenshot 5 from previous batch)
          ========================================================= */}
      {activeTab === 'restrolink' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* Section 1: Share Restro Link */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '10px' }}>
              Share Restro Link
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-card, #FFFFFF)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* URL Input Bar + Open Link Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'var(--color-muted, #F8FAFC)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '6px 6px 6px 14px',
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontSize: '0.86rem',
                    color: '#2563EB',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {restroLinkUrl}
                </span>

                <button
                  onClick={handleCopyRestroLink}
                  title="Copy Link"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: copiedRestroLink ? '#10B981' : 'var(--color-muted-foreground)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {copiedRestroLink ? <Check size={16} /> : <Copy size={16} />}
                </button>

                <button
                  onClick={() => window.open(restroLinkUrl, '_blank')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Open Link</span>
                </button>
              </div>

              {/* Custom Domain Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F5F3FF',
                  border: '1px solid #DDD6FE',
                  borderRadius: '10px',
                  padding: '10px 16px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#7C3AED',
                    cursor: 'pointer',
                  }}
                      onClick={() => addToast('Custom domain', 'A custom domain is not connected in this local build. Use the menu preview URL for now.', 'info')}
                >
                  Get Your Own Custom Domain
                </span>

                <button
                  onClick={() => addToast('QR Code', 'Download your custom RESTRO8 table/standee QR.', 'info')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <QrCode size={14} />
                  <span>Share QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Services */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '10px' }}>
              Services
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Delivery Service</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Would you like to offer delivery to your customers?
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                  style={{
                    width: '42px',
                    height: '24px',
                    borderRadius: '999px',
                    backgroundColor: deliveryEnabled ? '#10B981' : '#CBD5E1',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '3px',
                      left: deliveryEnabled ? '21px' : '3px',
                      transition: 'left 0.2s',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Share My Menu</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Would you like to share your menu?
                  </div>
                </div>

                <div
                  onClick={() => setShareMenuEnabled(!shareMenuEnabled)}
                  style={{
                    width: '42px',
                    height: '24px',
                    borderRadius: '999px',
                    backgroundColor: shareMenuEnabled ? '#10B981' : '#CBD5E1',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '3px',
                      left: shareMenuEnabled ? '21px' : '3px',
                      transition: 'left 0.2s',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Restaurant Details */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '10px' }}>
              Restaurant Details
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Phone Number</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                  Would you like to enable phone number for customers?
                </div>
              </div>

              <div
                onClick={() => setPhoneEnabled(!phoneEnabled)}
                style={{
                  width: '42px',
                  height: '24px',
                  borderRadius: '999px',
                  backgroundColor: phoneEnabled ? '#10B981' : '#CBD5E1',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: phoneEnabled ? '21px' : '3px',
                    transition: 'left 0.2s',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Address */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '10px' }}>
              Address
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <span>{selectedAddress}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>⌄</span>
              </div>

              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedAddress)}`, '_blank')}
                title="View on Maps"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                <MapPin size={17} />
              </button>
            </div>
          </div>

          {/* Section 5: Social Links */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.96rem', fontWeight: 800 }}>Social Links</span>
              <button
                onClick={() => setShowAddSocial(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>Add Links</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  style={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={16} color="var(--r8-brand-primary)" />
                    <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{link.platform}:</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.82rem', color: '#2563EB', textDecoration: 'none' }}
                    >
                      {link.url}
                    </a>
                  </div>
                  <button
                    onClick={() => setSocialLinks((prev) => prev.filter((l) => l.id !== link.id))}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Useful Links */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.96rem', fontWeight: 800 }}>Useful Links</span>
              <button
                onClick={() => setShowAddUseful(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>Add Links</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {usefulLinks.map((link) => (
                <div
                  key={link.id}
                  style={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={16} color="#10B981" />
                    <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{link.platform}:</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.82rem', color: '#2563EB', textDecoration: 'none' }}
                    >
                      {link.url}
                    </a>
                  </div>
                  <button
                    onClick={() => setUsefulLinks((prev) => prev.filter((l) => l.id !== link.id))}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: Menu Images (Matching Screenshot 1)
          ========================================================= */}
      {activeTab === 'menu_images' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* Share Menu Link Section */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '10px' }}>
              Share Menu Link
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-card, #FFFFFF)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* URL Input Bar + Open Link Button matching Screenshot 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'var(--color-muted, #F8FAFC)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '6px 6px 6px 14px',
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontSize: '0.86rem',
                    color: '#2563EB',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {menuLinkUrl}
                </span>

                <button
                  onClick={handleCopyMenuLink}
                  title="Copy Menu Link"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: copiedMenuLink ? '#10B981' : 'var(--color-muted-foreground)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {copiedMenuLink ? <Check size={16} /> : <Copy size={16} />}
                </button>

                <button
                  onClick={() => window.open(menuLinkUrl, '_blank')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Open Link</span>
                </button>
              </div>

              {/* Custom Domain Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F5F3FF',
                  border: '1px solid #DDD6FE',
                  borderRadius: '10px',
                  padding: '10px 16px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#7C3AED',
                    cursor: 'pointer',
                  }}
                      onClick={() => addToast('Custom domain', 'A custom domain is not connected in this local build. Use the menu preview URL for now.', 'info')}
                >
                  Get Your Own Custom Domain
                </span>

                <button
                  onClick={() => addToast('QR Code', 'Share digital menu QR code.', 'info')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <QrCode size={14} />
                  <span>Share QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upload Menu Section matching Screenshot 1 */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '4px' }}>
              Upload Menu
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginBottom: '14px' }}>
              Check your uploaded file and sort them accordingly.
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Upload Menu Box Button matching Screenshot 1 */}
              <label
                style={{
                  width: '200px',
                  height: '240px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--color-muted, #F8FAFC)',
                  border: '1.5px dashed var(--color-border, #CBD5E1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--r8-brand-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border, #CBD5E1)')}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddMenuImage}
                  style={{ display: 'none' }}
                />
                <div style={{ color: '#94A3B8', marginBottom: '8px' }}>
                  <Plus size={28} />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748B' }}>
                  Upload Menu
                </span>
              </label>

              {/* Uploaded Menu Images List */}
              {uploadedMenuImages.map((img, idx) => (
                <div
                  key={img.id}
                  style={{
                    width: '200px',
                    height: '240px',
                    borderRadius: '14px',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      padding: '8px 10px',
                      fontSize: '0.74rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--color-card)',
                      flex: 1,
                    }}
                  >
                    <span style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                      Page {idx + 1}
                    </span>
                    <button
                      onClick={() => setUploadedMenuImages((prev) => prev.filter((i) => i.id !== img.id))}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: Appearance (Matching Screenshots 2 & 3)
          ========================================================= */}
      {activeTab === 'appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Section 1: Restaurant Details matching Screenshot 3 */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '14px' }}>
              Restaurant Details
            </div>

            {/* Restaurant Logo Box with RI avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  backgroundColor: '#EDE9FE',
                  color: '#1E1B4B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.5px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                RI
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Restaurant Logo</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', margin: '2px 0 8px 0' }}>
                  Update new image to change your Restaurant Profile
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => addToast('Upload Logo', 'Image selector opened.', 'info')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'var(--r8-brand-primary)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => addToast('Reset Logo', 'Reset logo to default.', 'info')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-foreground)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields: Heading *, Bio *, Footer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Heading * */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Heading <span style={{ color: 'var(--r8-brand-primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Bio * with 0 / 200 character counter */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    Bio <span style={{ color: 'var(--r8-brand-primary)' }}>*</span>
                  </label>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-muted-foreground)' }}>
                    {bio.length} / 200
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={bio}
                  maxLength={200}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter bio"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.86rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Footer */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Footer
                </label>
                <input
                  type="text"
                  value={footerMsg}
                  onChange={(e) => setFooterMsg(e.target.value)}
                  placeholder="Enter a custom footer message for your link"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Layouts matching Screenshots 2 & 3 */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '14px' }}>
              Layouts
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Grid Layout Card */}
              <div
                onClick={() => setSelectedLayout('grid')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: 'pointer',
                  width: '160px',
                }}
              >
                {/* Mockup Preview Box */}
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-card, #FFFFFF)',
                    border: selectedLayout === 'grid' ? '2px solid #EF4444' : '1.5px solid var(--color-border)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  {/* Avatar circle */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    }}
                  />
                  {/* 2x2 grid rectangles */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px',
                      width: '100%',
                      flex: 1,
                    }}
                  >
                    <div style={{ backgroundColor: 'var(--color-muted, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    <div style={{ backgroundColor: 'var(--color-muted, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    <div style={{ backgroundColor: 'var(--color-muted, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    <div style={{ backgroundColor: 'var(--color-muted, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                  </div>
                </div>

                {/* Radio Label + Red Checkmark */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: selectedLayout === 'grid' ? 800 : 500 }}>
                    Grid Layout
                  </span>
                  {selectedLayout === 'grid' && (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1.5px solid #EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* List Layout Card */}
              <div
                onClick={() => setSelectedLayout('list')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: 'pointer',
                  width: '160px',
                }}
              >
                {/* Mockup Preview Box */}
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-card, #FFFFFF)',
                    border: selectedLayout === 'list' ? '2px solid #EF4444' : '1.5px solid var(--color-border)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  {/* Avatar circle */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    }}
                  />
                  {/* Horizontal bars */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      width: '100%',
                      flex: 1,
                    }}
                  >
                    <div style={{ height: '32px', backgroundColor: 'var(--color-muted, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    <div style={{ height: '32px', backgroundColor: 'var(--color-muted, #F8FAFC)', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                  </div>
                </div>

                {/* Radio Label */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: selectedLayout === 'list' ? 800 : 500 }}>
                    List Layout
                  </span>
                  {selectedLayout === 'list' && (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1.5px solid #EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Color Palettes matching Screenshot 2 */}
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '14px' }}>
              Color Palettes
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '16px',
              }}
            >
              {[
                {
                  id: 'light',
                  title: 'Light',
                  desc: 'Black and white',
                  colors: ['#000000', '#262626', '#FFFFFF'],
                },
                {
                  id: 'dark_vibes',
                  title: 'Dark Vibes',
                  desc: 'Dark night',
                  colors: ['#9CA3AF', '#374151', '#000000'],
                },
                {
                  id: 'rustic_charm',
                  title: 'Rustic Charm',
                  desc: 'Warm & Homely',
                  colors: ['#38BDF8', '#0284C7', '#F8FAFC'],
                },
                {
                  id: 'green_gourmet',
                  title: 'Green Gourmet',
                  desc: 'Fresh & Organic',
                  colors: ['#0284C7', '#0369A1', '#F8FAFC'],
                },
                {
                  id: 'elegant_evenings',
                  title: 'Elegant Evenings',
                  desc: 'Luxe & Romantic',
                  colors: ['#78716C', '#A8A29E', '#B45309'],
                },
                {
                  id: 'midnight_feast',
                  title: 'Midnight Feast',
                  desc: 'Luxe & Moody',
                  colors: ['#475569', '#818CF8', '#F8FAFC'],
                },
              ].map((pal) => {
                const isSelected = selectedPalette === pal.id;
                return (
                  <div
                    key={pal.id}
                    onClick={() => {
                      setSelectedPalette(pal.id);
                      addToast('Palette Applied', `Selected "${pal.title}" color palette.`, 'info');
                    }}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #EF4444' : '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>{pal.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                        {pal.desc}
                      </div>
                    </div>

                    {/* Color Swatch Circles */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {pal.colors.map((c, i) => (
                        <div
                          key={i}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Color Box matching Screenshot 2 */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '16px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              {/* Custom Header with Theme Color Water Droplet */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Custom</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Theme Color</span>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Droplet size={14} />
                  </div>
                </div>
              </div>

              {/* 4 Custom Color Inputs matching Screenshot 2 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '14px',
                }}
              >
                {/* Background */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Background
                  </label>
                  <div
                    style={{
                      height: '38px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: customBg,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <Droplet size={14} color="#64748B" />
                  </div>
                </div>

                {/* Card */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Card
                  </label>
                  <div
                    style={{
                      height: '38px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: customCard,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <Droplet size={14} color="#64748B" />
                  </div>
                </div>

                {/* Card Text */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Card Text
                  </label>
                  <div
                    style={{
                      height: '38px',
                      borderRadius: '8px',
                      border: '1px solid #000000',
                      backgroundColor: customCardText,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <Droplet size={14} color="#FFFFFF" />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Text
                  </label>
                  <div
                    style={{
                      height: '38px',
                      borderRadius: '8px',
                      border: '1px solid #000000',
                      backgroundColor: customText,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <Droplet size={14} color="#FFFFFF" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Social Modal */}
      {showAddSocial && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              padding: '20px',
              width: '100%',
              maxWidth: '380px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800 }}>Add Social Link</div>
              <button onClick={() => setShowAddSocial(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Platform</label>
              <input
                type="text"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                placeholder="e.g. Instagram, Facebook, WhatsApp"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>URL</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowAddSocial(false)}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSocialLink}
                disabled={!newPlatform || !newUrl}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--r8-brand-primary)', color: '#FFFFFF', cursor: 'pointer', fontWeight: 700 }}
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Useful Modal */}
      {showAddUseful && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              padding: '20px',
              width: '100%',
              maxWidth: '380px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800 }}>Add Useful Link</div>
              <button onClick={() => setShowAddUseful(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Label</label>
              <input
                type="text"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                placeholder="e.g. FoodMandu, BhojDeal, TripAdvisor"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>URL</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowAddUseful(false)}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUsefulLink}
                disabled={!newPlatform || !newUrl}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--r8-brand-primary)', color: '#FFFFFF', cursor: 'pointer', fontWeight: 700 }}
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
