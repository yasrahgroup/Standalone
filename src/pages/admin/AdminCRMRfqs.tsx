// src/pages/admin/AdminCRMRfqs.tsx
import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Search, CheckCircle2, Trash2, Globe, Building } from 'lucide-react';
import { cmsService, CmsRfq } from '../../services/cmsService';

export const AdminCRMRfqs: React.FC = () => {
  const [rfqs, setRfqs] = useState<CmsRfq[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRfq, setSelectedRfq] = useState<CmsRfq | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadRfqs = async () => {
    try {
      const data = await cmsService.fetchRfqs();
      setRfqs(data || []);
      if (data && data.length > 0 && !selectedRfq) {
        setSelectedRfq(data[0]);
      }
    } catch {
      setRfqs([]);
    }
  };

  useEffect(() => {
    loadRfqs();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await cmsService.updateRfqStatus(id, newStatus);
      setNotification(`RFQ status updated to ${newStatus}`);
      setTimeout(() => setNotification(null), 3000);
      loadRfqs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this RFQ submission?')) {
      try {
        await cmsService.deleteRfq(id);
        setSelectedRfq(null);
        loadRfqs();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filtered = rfqs.filter((r) => {
    return r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (r.projectType && r.projectType.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileSpreadsheet color="#D97706" /> Quote Requests Pipeline (RFQ CRM)
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.375rem' }}>
          Track comprehensive project quote requests, solution scopes, budget tiers, and delivery horizons.
        </p>
      </div>

      {notification && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', color: '#047857', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '1.5rem', minHeight: '650px' }}>
        {/* Left Column: RFQs List */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search quotes by client, company, or scope..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', backgroundColor: 'transparent', border: 'none', color: '#0F172A', fontSize: '0.8125rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
                No RFQ requests found.
              </div>
            ) : (
              filtered.map((rfq) => {
                const isSelected = selectedRfq?.id === rfq.id;
                return (
                  <div
                    key={rfq.id}
                    onClick={() => setSelectedRfq(rfq)}
                    style={{
                      padding: '0.875rem',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#FEF3C7' : 'transparent',
                      border: isSelected ? '1px solid #FDE68A' : '1px solid transparent',
                      marginBottom: '0.375rem',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? '#B45309' : '#0F172A' }}>
                        {rfq.name}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                        {new Date(rfq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {rfq.companyName} • {rfq.country}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', color: '#475569' }}>
                      <span style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                        {rfq.estimatedBudget || 'Flexible'}
                      </span>
                      <span style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                        {rfq.expectedTimeline || 'Normal'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: RFQ Details */}
        {selectedRfq ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>
                    {selectedRfq.name}
                  </h2>
                  <div style={{ fontSize: '0.875rem', color: '#D97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building size={14} /> {selectedRfq.companyName} • <Globe size={14} /> {selectedRfq.country}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <select
                    value={selectedRfq.status || 'NEW'}
                    onChange={(e) => handleStatusChange(selectedRfq.id, e.target.value)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontWeight: 600,
                      borderRadius: '8px',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  >
                    <option value="NEW">NEW RFQ</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="CLARIFICATION_REQUIRED">CLARIFICATION REQ</option>
                    <option value="PROPOSAL_PREPARATION">PROPOSAL PREPARATION</option>
                    <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
                    <option value="WON">WON / CLOSED</option>
                    <option value="LOST">LOST</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedRfq.id)}
                    style={{ background: '#FFE4E6', border: '1px solid #FECDD3', color: '#BE123C', borderRadius: '6px', cursor: 'pointer', padding: '0.45rem', display: 'flex', alignItems: 'center' }}
                    title="Delete RFQ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Scope & Budget Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Scope / Solutions</div>
                  <div style={{ fontSize: '0.875rem', color: '#18181B', fontWeight: 700 }}>{selectedRfq.projectType}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Budget Range</div>
                  <div style={{ fontSize: '0.875rem', color: '#D97706', fontWeight: 700 }}>{selectedRfq.estimatedBudget}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Target Timeline</div>
                  <div style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 500 }}>{selectedRfq.expectedTimeline}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Work Email</div>
                  <a href={`mailto:${selectedRfq.email}`} style={{ fontSize: '0.875rem', color: '#18181B', fontWeight: 600, textDecoration: 'none' }}>
                    {selectedRfq.email}
                  </a>
                </div>
              </div>

              {/* Requirements Description */}
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Architecture & Project Requirements
                </h4>
                <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9375rem', color: '#1E293B', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedRfq.projectDescription}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
              <a
                href={`mailto:${selectedRfq.email}?subject=Regarding Your RFQ with Azaroth Tech-Hive`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  backgroundColor: '#18181B',
                  border: '1px solid #09090B',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0, 108, 53, 0.25)',
                }}
              >
                Reply via Official Email
              </a>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            Select an RFQ to view project scope and update pipeline status.
          </div>
        )}
      </div>
    </div>
  );
};
