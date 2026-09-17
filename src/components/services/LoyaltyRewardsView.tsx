import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Stamp,
  Ticket,
  CheckCircle,
  Trophy,
  Gift,
  X,
  Trash2,
} from 'lucide-react';

interface LoyaltyProgram {
  id: string;
  sn: number;
  name: string;
  engagedUsers: number;
  stampsRequired: number;
  reward: string;
  expiresIn: string;
  description: string;
  available: boolean;
}

export const LoyaltyRewardsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);

  // Modal form states
  const [progName, setProgName] = useState('');
  const [stampsRequired, setStampsRequired] = useState(10);
  const [reward, setReward] = useState('Free Special Masala Chiya');
  const [expiresIn, setExpiresIn] = useState('30 Days');
  const [description, setDescription] = useState('Collect 10 stamps on Chiya orders and receive a complimentary Special Masala Chiya.');

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progName.trim()) return;

    const newProg: LoyaltyProgram = {
      id: `prog-${Date.now()}`,
      sn: programs.length + 1,
      name: progName.trim(),
      engagedUsers: 0,
      stampsRequired: Number(stampsRequired) || 10,
      reward: reward.trim(),
      expiresIn: expiresIn.trim(),
      description: description.trim(),
      available: true,
    };

    setPrograms([...programs, newProg]);
    setProgName('');
    setIsAddModalOpen(false);
  };

  const toggleAvailability = (id: string) => {
    setPrograms(
      programs.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  const filtered = programs.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header matching Screenshot 3 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: 'var(--color-foreground)',
          }}
        >
          Loyalty & Rewards
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Search size={15} color="var(--color-muted-foreground)" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.84rem',
                color: 'var(--color-foreground)',
                width: '130px',
              }}
            />
          </div>

          {/* + Add New [N] Red Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--r8-brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
            }}
          >
            <Plus size={16} /> Add New
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginLeft: '2px',
              }}
            >
              N
            </span>
          </button>

          {/* Options ⋯ */}
          <button
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-muted-foreground)',
            }}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards matching Screenshot 3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        {/* KPI 1: Total Programs */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stamp size={14} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Total Programs
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            {programs.length}
          </div>
        </div>

        {/* KPI 2: Assigned Stamps */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#EDE9FE',
                color: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ticket size={14} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Assigned Stamps
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            0
          </div>
        </div>

        {/* KPI 3: Completion Rate */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#E8F8F0',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={14} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Completion Rate
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            0.00%
          </div>
        </div>

        {/* KPI 4: Most Performing */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy size={14} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Most Performing
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            --
          </div>
        </div>

        {/* KPI 5: Total Rewards Redeemed */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#CCFBF1',
                color: '#0D9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Gift size={14} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Total Rewards Redeemed
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            0
          </div>
        </div>
      </div>

      {/* Main Table Container matching Screenshot 3 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          minHeight: '440px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '840px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800, width: '50px' }}>SN</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Program Name</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Engaged Users</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Stamps Required</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Reward</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Expires In</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Description</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800, width: '100px' }}>Available</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prog) => (
                <tr key={prog.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px', fontWeight: 700 }}>{prog.sn}</td>
                  <td style={{ padding: '16px', fontWeight: 800 }}>{prog.name}</td>
                  <td style={{ padding: '16px' }}>{prog.engagedUsers}</td>
                  <td style={{ padding: '16px', fontWeight: 700 }}>{prog.stampsRequired} Stamps</td>
                  <td style={{ padding: '16px', color: '#10B981', fontWeight: 700 }}>{prog.reward}</td>
                  <td style={{ padding: '16px' }}>{prog.expiresIn}</td>
                  <td style={{ padding: '16px', color: 'var(--color-muted-foreground)', fontSize: '0.82rem' }}>
                    {prog.description}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => toggleAvailability(prog.id)}
                      style={{
                        width: '38px',
                        height: '20px',
                        borderRadius: '20px',
                        backgroundColor: prog.available ? '#10B981' : '#E5E7EB',
                        position: 'relative',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          position: 'absolute',
                          top: '2px',
                          left: prog.available ? '20px' : '2px',
                          transition: 'left 0.2s',
                        }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State Illustration matching Screenshot 3 */}
        {filtered.length === 0 && (
          <div
            style={{
              padding: '60px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              margin: 'auto 0',
            }}
          >
            {/* Fanned out colored sheets */}
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '42px',
                  borderRadius: '5px',
                  backgroundColor: '#10B981',
                  transform: 'rotate(-20deg) translate(-10px, 0)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '34px',
                  height: '44px',
                  borderRadius: '5px',
                  backgroundColor: '#2563EB',
                  zIndex: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '18px', height: '2px', backgroundColor: '#FFFFFF' }} />
                <div style={{ width: '14px', height: '2px', backgroundColor: '#FFFFFF', opacity: 0.8 }} />
                <div style={{ width: '10px', height: '2px', backgroundColor: '#FFFFFF', opacity: 0.6 }} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '42px',
                  borderRadius: '5px',
                  backgroundColor: '#8B5CF6',
                  transform: 'rotate(20deg) translate(10px, 0)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}
              />
            </div>

            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: 'var(--color-foreground)',
                margin: '0 0 6px 0',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              No Stamp Program found
            </h3>
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--color-muted-foreground)',
                margin: '0 0 20px 0',
              }}
            >
              Create stamp programs to reward your loyal customers and keep them coming back!
            </p>

            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
              }}
            >
              <Plus size={16} /> Add New
            </button>
          </div>
        )}

        {/* Bottom selection counter */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.82rem',
            color: 'var(--color-muted-foreground)',
          }}
        >
          0 of {filtered.length} row(s) selected.
        </div>
      </div>

      {/* Create Stamp Program Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
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
              width: '100%',
              maxWidth: '480px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Create Stamp Program</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProgram}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Program Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chiya Loyalty Pass"
                  value={progName}
                  onChange={(e) => setProgName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Stamps Required</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={stampsRequired}
                    onChange={(e) => setStampsRequired(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Expires In</label>
                  <input
                    type="text"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Reward Description</label>
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="e.g. Free Special Masala Chiya"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Public Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'var(--r8-brand-primary)', color: '#FFF', border: 'none', fontWeight: 800 }}
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
