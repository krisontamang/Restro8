import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Edit3,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Calendar,
  Bell,
  ThumbsUp,
  Share2,
  UserCheck,
  LogOut,
  Check,
} from 'lucide-react';

interface UserProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
}

export const UserProfilePopover: React.FC<UserProfilePopoverProps> = ({
  isOpen,
  onClose,
  collapsed,
}) => {
  const {
    darkMode,
    setDarkMode,
    dateMode,
    toggleDateMode,
    addToast,
    setActiveTab,
  } = useRestaurant();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        addToast('Fullscreen Error', 'Could not enter fullscreen mode.', 'warning');
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleShareProfile = () => {
    const profileUrl = 'https://core.restro8.app/profile/kirtimantamang';
    navigator.clipboard?.writeText(profileUrl);
    addToast('Profile Link Copied', profileUrl, 'success');
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackOpen(false);
      setFeedbackSent(false);
      setFeedbackText('');
      addToast('Feedback Sent', 'Thank you for helping improve RESTRO8 Nepal!', 'success');
    }, 900);
  };

  const handleLogout = () => {
    onClose();
    addToast('Local workspace', 'Authentication is not connected in this preview. No account was signed out.', 'info');
  };

  return (
    <>
      {/* Invisible backdrop to dismiss popover when clicking outside */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          backgroundColor: 'transparent',
        }}
      />

      {/* Floating Popover Container matching Screenshot 4 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: '72px',
          left: collapsed ? '80px' : '14px',
          width: '320px',
          backgroundColor: 'var(--color-card, #FFFFFF)',
          borderRadius: '16px',
          border: '1px solid var(--color-border, #E2E8F0)',
          boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.16), 0 0 1px rgba(0, 0, 0, 0.08)',
          zIndex: 100,
          padding: '16px',
          color: 'var(--color-foreground, #0F172A)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* User Card Header: KT avatar + Kirtiman Tamang info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Soft lavender avatar badge */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'var(--r8-sidebar-active-bg)',
              color: 'var(--r8-sidebar-active-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              flexShrink: 0,
              letterSpacing: '-0.5px',
            }}
          >
            KT
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '1.02rem',
                fontWeight: 800,
                color: 'var(--color-foreground, #0F172A)',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Kirtiman Tamang
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#64748B',
                fontWeight: 500,
                marginTop: '1px',
              }}
            >
              @kirtimantamang
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#334155',
                fontWeight: 600,
                marginTop: '1px',
              }}
            >
              977 9821828807
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--color-border, #E2E8F0)',
            margin: '14px 0 10px 0',
          }}
        />

        {/* Menu Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* 1. Profile Setting */}
          <button
            onClick={() => {
              onClose();
              addToast('Profile Settings', 'User Profile: Kirtiman Tamang (Phone: 977 9821828807)', 'info');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-foreground, #0F172A)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Edit3 size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
            <span>Profile Setting</span>
          </button>

          {/* 2. Dark Theme Toggle */}
          <div
            onClick={() => setDarkMode(!darkMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {darkMode ? (
                <Moon size={17} style={{ color: '#F59E0B' }} />
              ) : (
                <Sun size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Dark Theme</span>
            </div>

            {/* Toggle switch */}
            <div
              style={{
                width: '42px',
                height: '24px',
                borderRadius: '999px',
                backgroundColor: darkMode ? 'var(--r8-brand-primary)' : '#CBD5E1',
                position: 'relative',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
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
                  left: darkMode ? '21px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>

          {/* 3. Enter Full Screen */}
          <button
            onClick={toggleFullscreen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-foreground, #0F172A)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {isFullscreen ? (
              <Minimize2 size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
            ) : (
              <Maximize2 size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
            )}
            <span>{isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}</span>
          </button>

          {/* 4. Date Mode (AD / BS toggle) matching Screenshot 4 */}
          <div
            onClick={toggleDateMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Date Mode</span>
            </div>

            {/* AD / BS switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: dateMode === 'AD' ? 800 : 500,
                  color: dateMode === 'AD' ? 'var(--color-foreground, #0F172A)' : '#94A3B8',
                }}
              >
                AD
              </span>

              {/* Slider pill */}
              <div
                style={{
                  width: '42px',
                  height: '24px',
                  borderRadius: '999px',
                  backgroundColor: dateMode === 'BS' ? 'var(--r8-brand-primary)' : '#CBD5E1',
                  position: 'relative',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
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
                    left: dateMode === 'BS' ? '21px' : '3px',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: dateMode === 'BS' ? 800 : 500,
                  color: dateMode === 'BS' ? 'var(--r8-brand-primary)' : '#94A3B8',
                }}
              >
                BS
              </span>
            </div>
          </div>

          {/* 5. Invitation */}
          <button
            onClick={() => {
              navigator.clipboard?.writeText('https://core.restro8.app/invite/CHYADURBAR-2026');
              addToast('Staff Invite Copied', 'Invitation URL copied: https://core.restro8.app/invite/CHYADURBAR-2026', 'success');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-foreground, #0F172A)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Bell size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
            <span>Invitation</span>
          </button>

          {/* 6. Give Feedback */}
          <button
            onClick={() => setFeedbackOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-foreground, #0F172A)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ThumbsUp size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
            <span>Give Feedback</span>
          </button>

          {/* 7. Share Profile */}
          <button
            onClick={handleShareProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-foreground, #0F172A)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Share2 size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
            <span>Share Profile</span>
          </button>

          {/* 8. User Notification Preferences */}
          <button
            onClick={() => {
              onClose();
              setActiveTab('notifications');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-foreground, #0F172A)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <UserCheck size={17} style={{ color: 'var(--color-foreground, #1E293B)' }} />
            <span>User Notification Preferences</span>
          </button>
        </div>

        {/* Bottom Button: [->] Log out */}
        <div style={{ marginTop: '14px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--color-muted, #F1F5F9)',
              color: 'var(--color-foreground, #0F172A)',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--r8-sidebar-active-bg)';
              e.currentTarget.style.color = 'var(--r8-sidebar-active-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-muted, #F1F5F9)';
              e.currentTarget.style.color = 'var(--color-foreground, #0F172A)';
            }}
          >
            <LogOut size={17} />
            <span>Log out</span>
          </button>
        </div>

        {/* Optional Feedback Mini Modal */}
        {feedbackOpen && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--color-card, #FFFFFF)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>
              Send Feedback to RESTRO8
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>
              Let us know your ideas or report an issue with the restaurant OS.
            </div>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what you like or what can be improved..."
              rows={4}
              style={{
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #E2E8F0)',
                padding: '10px',
                fontSize: '0.85rem',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                resize: 'none',
                outline: 'none',
                marginBottom: '12px',
                fontFamily: 'inherit',
              }}
            />

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                onClick={() => setFeedbackOpen(false)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendFeedback}
                disabled={!feedbackText.trim() || feedbackSent}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: feedbackSent ? '#10B981' : 'var(--r8-brand-primary)',
                  color: '#FFFFFF',
                  cursor: feedbackText.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {feedbackSent ? (
                  <>
                    <Check size={16} /> Sent!
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
