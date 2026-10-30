// src/pages/admin/AdminAuditLogs.tsx
import React, { useState, useEffect } from 'react';
import { History, Search } from 'lucide-react';
import { cmsService, CmsAuditLog } from '../../services/cmsService';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<CmsAuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cmsService.fetchAuditLogs().then(data => {
      setLogs(data || []);
    }).catch(() => {
      setLogs([]);
    });
  }, []);

  const filtered = logs.filter(l => {
    return l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           l.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
           l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (l.entityType && l.entityType.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <History color="#E11D48" /> Security & Modification Audit Trail
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.375rem' }}>
          Immutable log of all administrative actions, logins, content revisions, and system modifications.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', marginBottom: '1.5rem' }}>
        <Search size={18} color="#64748B" />
        <input
          type="text"
          placeholder="Filter audit trail by user, action, module, or entity..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', backgroundColor: 'transparent', border: 'none', color: '#0F172A', fontSize: '0.875rem', outline: 'none' }}
        />
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Timestamp</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>User</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Action</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Module</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Entity</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                  No audit entries found.
                </td>
              </tr>
            ) : (
              filtered.map((log) => {
                const isCreate = log.action.includes('CREATE');
                const isDelete = log.action.includes('DELETE');
                const isUpdate = log.action.includes('UPDATE');
                const badgeBg = isCreate ? '#ECFDF5' : isDelete ? '#FFE4E6' : isUpdate ? '#FEF3C7' : '#F1F5F9';
                const badgeColor = isCreate ? '#047857' : isDelete ? '#BE123C' : isUpdate ? '#B45309' : '#334155';
                const badgeBorder = isCreate ? '#A7F3D0' : isDelete ? '#FECDD3' : isUpdate ? '#FDE68A' : '#E2E8F0';

                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748B', fontSize: '0.8125rem' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0F172A' }}>
                      {log.userName}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeBorder}`,
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#334155', fontWeight: 500 }}>{log.module}</td>
                    <td style={{ padding: '1rem', color: '#64748B', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {log.entityType} ({log.entityId || 'none'})
                    </td>
                    <td style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.75rem' }}>{log.ipAddress}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
