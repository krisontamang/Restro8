import React, { useState } from 'react';
import { MenuItem } from '../../types/restaurant';
import { Button, PriceDisplay, Modal } from '../ui';
import { X, Sparkles, MessageSquare } from 'lucide-react';

interface POSCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (item: MenuItem, selectedOptions: Record<string, string>, notes: string) => void;
}

const POSCustomizerModalContent: React.FC<{
  item: MenuItem;
  onClose: () => void;
  onConfirm: (item: MenuItem, selectedOptions: Record<string, string>, notes: string) => void;
}> = ({ item, onClose, onConfirm }) => {
  // Initialize options with first choice for each group
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    item.options?.forEach((opt) => {
      if (opt.choices.length > 0) {
        initial[opt.name] = opt.choices[0].label;
      }
    });
    return initial;
  });

  const [notes, setNotes] = useState<string>('');

  // Calculate dynamic extra charges from selected options
  let extraCharges = 0;
  item.options?.forEach((opt) => {
    const selectedLabel = selectedOptions[opt.name];
    const choice = opt.choices.find((c) => c.label === selectedLabel);
    if (choice?.extraPrice) {
      extraCharges += choice.extraPrice;
    }
  });

  const finalPrice = item.price + extraCharges;

  const quickNotes = ['कम पिरो (Mild)', 'अति पिरो (Extra Spicy)', 'बिना धनिया (No Coriander)', 'झोल थपिदिनु (Extra Jhol)', 'Less Oil'];

  const handleConfirm = () => {
    onConfirm(item, selectedOptions, notes);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Customize ${item.name}`} size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-5)' }}>
        {/* Header Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--r8-space-3) var(--r8-space-4)',
            backgroundColor: 'var(--r8-bg-surface-elevated)',
            borderRadius: 'var(--r8-radius-md)',
            border: '1px solid var(--r8-border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--r8-text-muted)' }}>Base Price</div>
            <PriceDisplay amount={item.price} size="md" />
          </div>
          {extraCharges > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--r8-brand-accent)' }}>+ Extra Options</div>
              <PriceDisplay amount={extraCharges} size="sm" />
            </div>
          )}
        </div>

        {/* Option Choice Groups */}
        {item.options && item.options.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-4)' }}>
            {item.options.map((opt) => (
              <div key={opt.name}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--r8-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: 'var(--r8-space-2)',
                  }}
                >
                  {opt.name}
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: 'var(--r8-space-2)',
                  }}
                >
                  {opt.choices.map((choice) => {
                    const isSelected = selectedOptions[opt.name] === choice.label;
                    return (
                      <button
                        type="button"
                        key={choice.label}
                        onClick={() =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [opt.name]: choice.label,
                          }))
                        }
                        style={{
                          padding: 'var(--r8-space-3)',
                          borderRadius: 'var(--r8-radius-md)',
                          border: isSelected
                            ? '2px solid var(--r8-brand-primary)'
                            : '1px solid var(--r8-border-subtle)',
                          backgroundColor: isSelected
                            ? 'rgba(14, 165, 233, 0.08)'
                            : 'var(--r8-bg-surface-elevated)',
                          color: isSelected
                            ? 'var(--r8-brand-primary)'
                            : 'var(--r8-text-primary)',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.84rem',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all var(--r8-transition-fast)',
                        }}
                      >
                        <span>{choice.label}</span>
                        {choice.extraPrice > 0 && (
                          <span
                            style={{
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: 'var(--r8-brand-accent)',
                              backgroundColor: 'rgba(245, 158, 11, 0.1)',
                              padding: '2px 6px',
                              borderRadius: 'var(--r8-radius-sm)',
                            }}
                          >
                            +{choice.extraPrice}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Special Kitchen Notes */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--r8-space-2)',
            }}
          >
            <label
              htmlFor="pos-item-notes"
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--r8-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <MessageSquare size={14} /> Kitchen Special Note
            </label>
          </div>

          {/* Quick preset chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: 'var(--r8-space-2)',
            }}
          >
            {quickNotes.map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => setNotes((prev) => (prev ? `${prev}, ${chip}` : chip))}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: 'var(--r8-radius-full)',
                  border: '1px solid var(--r8-border-subtle)',
                  backgroundColor: 'var(--r8-bg-surface-elevated)',
                  color: 'var(--r8-text-muted)',
                  cursor: 'pointer',
                }}
              >
                + {chip}
              </button>
            ))}
          </div>

          <textarea
            id="pos-item-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. कम पिरो, no fresh coriander, extra achar pack..."
            style={{
              width: '100%',
              padding: 'var(--r8-space-3)',
              borderRadius: 'var(--r8-radius-md)',
              border: '1px solid var(--r8-border-subtle)',
              backgroundColor: 'var(--r8-bg-surface-elevated)',
              color: 'var(--r8-text-primary)',
              fontSize: '0.86rem',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Modal Action Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 'var(--r8-space-3)',
            paddingTop: 'var(--r8-space-3)',
            borderTop: '1px solid var(--r8-border-subtle)',
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            <span>Add to Ticket</span>
            <span style={{ opacity: 0.85 }}>&bull;</span>
            <PriceDisplay amount={finalPrice} size="sm" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const POSCustomizerModal: React.FC<POSCustomizerModalProps> = ({
  item,
  onClose,
  onConfirm,
}) => {
  if (!item) return null;
  return <POSCustomizerModalContent item={item} onClose={onClose} onConfirm={onConfirm} />;
};

