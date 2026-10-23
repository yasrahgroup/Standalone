// src/pages/admin/AdminCRMInquiries.tsx
import React, { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle2, Trash2, MessageSquare } from 'lucide-react';
import { cmsService, CmsEnquiry } from '../../services/cmsService';

export const AdminCRMInquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<CmsEnquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CmsEnquiry | null>(null);
  const [followUpNote, setFollowUpNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await cmsService.fetchEnquiries();
      setEnquiries(data || []);
      if (data && data.length > 0 && !selectedEnquiry) {
        setSelectedEnquiry(data[0]);
        setFollowUpNote(data[0].followUpNote || '');
      }
    } catch {
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await cmsService.updateEnquiryStatus(id, newStatus, followUpNote);
      setNotification(`Status updated to ${newStatus}`);
      setTimeout(() => setNotification(null), 3000);
      loadEnquiries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedEnquiry) return;
    try {
      await cmsService.updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, followUpNote);
      setNotification('Follow-up notes saved!');
      setTimeout(() => setNotification(null), 3000);
      loadEnquiries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this inquiry?')) {
      try {
        await cmsService.deleteEnquiry(id);
        setSelectedEnquiry(null);
        loadEnquiries();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filtered = enquiries.filter((e) => {
    return e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (e.companyName && e.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
           e.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Mail color="#047857" /> Inquiries CRM & Leads Inbox
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.375rem' }}>
          Manage inbound client contact form submissions, update engagement status, and track team follow-up notes.
        </p>
      </div>

      {notification && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', color: '#047857', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.5rem', minHeight: '650px' }}>
        {/* Left Column: Inbox List */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          {/* Search Bar */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', backgroundColor: 'transparent', border: 'none', color: '#0F172A', fontSize: '0.8125rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {loading ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
                Loading inquiries...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
                No contact inquiries found.
              </div>
            ) : (
              filtered.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                return (
                  <div
                    key={enq.id}
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setFollowUpNote(enq.followUpNote || '');
                    }}
                    style={{
                      padding: '0.875rem',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#F4F4F5' : 'transparent',
                      border: isSelected ? '1px solid #E4E4E7' : '1px solid transparent',
                      marginBottom: '0.375rem',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? '#18181B' : '#0F172A' }}>
                        {enq.name}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {enq.companyName || enq.email}
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {enq.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Inquiry Details & Notes */}
        {selectedEnquiry ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>
                    {selectedEnquiry.name}
                  </h2>
                  <div style={{ fontSize: '0.875rem', color: '#047857', fontWeight: 600 }}>
                    {selectedEnquiry.companyName}
                  </div>
                </div>

                {/* Status Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <select
                    value={selectedEnquiry.status || 'NEW'}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
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
                    <option value="NEW">NEW LEAD</option>
                    <option value="OPEN">OPEN</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="PROPOSAL">PROPOSAL SENT</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    style={{ background: '#FFE4E6', border: '1px solid #FECDD3', color: '#BE123C', borderRadius: '6px', cursor: 'pointer', padding: '0.45rem', display: 'flex', alignItems: 'center' }}
                    title="Delete lead"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Contact Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Email</div>
                  <a href={`mailto:${selectedEnquiry.email}`} style={{ fontSize: '0.875rem', color: '#18181B', fontWeight: 600, textDecoration: 'none' }}>
                    {selectedEnquiry.email}
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Phone</div>
                  <div style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 500 }}>
                    {selectedEnquiry.phone || 'Not provided'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Received At</div>
                  <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Client Message / Request
                </h4>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9375rem', color: '#1E293B', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Internal Follow-Up Notes */}
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MessageSquare size={14} color="#D97706" /> Team Follow-Up & CRM Notes
                </h4>
                <textarea
                  rows={4}
                  placeholder="Record call notes, proposal status, or next follow-up action..."
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.75rem', color: '#0F172A', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={handleSaveNote}
                style={{ padding: '0.625rem 1.5rem', backgroundColor: '#047857', border: '1px solid #065F46', borderRadius: '8px', color: '#FFF', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 6px rgba(4, 120, 87, 0.25)' }}
              >
                Save Lead Notes
              </button>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            Select an inquiry to view details and update status.
          </div>
        )}
      </div>
    </div>
  );
};
