import React, { useState } from 'react';
import { ThumbsUp, Plus, X, Upload, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export interface FeedbackTicket {
  id: string;
  sn: number;
  ticketNo: string;
  issueType: string;
  reportedAt: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  summary: string;
  description: string;
}

export const SupportFeedbackView: React.FC = () => {
  const { addToast } = useRestaurant();

  // Feedback tickets list state
  const [tickets, setTickets] = useState<FeedbackTicket[]>([]);

  // Modal state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [issueType, setIssueType] = useState('Feature Request');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      addToast('Validation', 'Please provide a feedback summary.', 'error');
      return;
    }

    const newTicket: FeedbackTicket = {
      id: `tkt-${Date.now()}`,
      sn: tickets.length + 1,
      ticketNo: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      issueType,
      reportedAt: '14 Sep 2026 08:58 PM',
      status: 'Open',
      summary: summary.trim(),
      description: description.trim(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSummary('');
    setDescription('');
    setIsFeedbackModalOpen(false);
    addToast(
      'Feedback Submitted',
      `Ticket ${newTicket.ticketNo} logged with RESTRO8 Nepal support team.`,
      'success'
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
      {/* Top Header matching Screenshot 5 */}
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
          Support &amp; Feedback
        </h1>

        <button
          type="button"
          onClick={() => setIsFeedbackModalOpen(true)}
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
            transition: 'background-color 0.15s ease',
          }}
        >
          <ThumbsUp size={14} />
          <span>Give Feedback</span>
        </button>
      </div>

      {/* Main Table Area matching Screenshot 5 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <table
          style={{
            width: '100%',
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
              <th style={{ padding: '12px 16px', fontWeight: 600, width: '60px' }}>SN</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, width: '130px' }}>Ticket No.</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, width: '160px' }}>Issue Type</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, width: '180px' }}>Reported At</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, width: '120px' }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Summary</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: 'transparent',
                  }}
                >
                  <td style={{ padding: '14px 16px', color: '#6B7280' }}>{row.sn}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#2563EB' }}>
                    {row.ticketNo}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-foreground)', fontWeight: 500 }}>
                    {row.issueType}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280' }}>{row.reportedAt}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor:
                          row.status === 'Resolved'
                            ? '#D1FAE5'
                            : row.status === 'In Progress'
                            ? '#FEF3C7'
                            : '#FEE2E2',
                        color:
                          row.status === 'Resolved'
                            ? '#065F46'
                            : row.status === 'In Progress'
                            ? '#92400E'
                            : '#991B1B',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-foreground)' }}>
                    {row.summary}
                  </td>
                </tr>
              ))
            ) : (
              /* Authentic Fanned Empty State matching Screenshot 5 */
              <tr>
                <td colSpan={6} style={{ padding: '80px 20px', textAlign: 'center' }}>
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
                    No Support &amp; Feedback found
                  </div>
                  <div
                    onClick={() => setIsFeedbackModalOpen(true)}
                    style={{
                      fontSize: '0.82rem',
                      color: '#4B5563',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Create a Feedback.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Give Feedback Modal */}
      {isFeedbackModalOpen && (
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
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Give Feedback</h2>
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={18} color="#9CA3AF" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Issue Type
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
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
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Printer & Hardware">Printer &amp; Hardware</option>
                  <option value="IRD Billing & Tax">IRD Billing &amp; Tax</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Summary <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of your feedback or issue"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Detailed Description
                </label>
                <textarea
                  placeholder="Please describe steps, suggestions or errors encountered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Attachments (Optional)
                </label>
                <div
                  onClick={() => addToast('Attachment', 'Select log or screenshot file.', 'info')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px dashed var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: '#9CA3AF',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} />
                  <span>Click here to upload logs or screenshots</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
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
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
