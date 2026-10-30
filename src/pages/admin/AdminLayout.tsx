// src/pages/admin/AdminLayout.tsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Layers,
  Briefcase,
  BookOpen,
  MessageSquareQuote,
  Navigation,
  Mail,
  FileSpreadsheet,
  Image,
  Settings,
  History,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  KeyRound,
  Database
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCMS } from '../../context/CMSContext';
import logoImg from '../../assets/Logo.png';
import { CustomCursor } from '../../components/common/CustomCursor';

export const AdminLayout: React.FC = () => {
  const { user, logout, isSuperAdmin } = useAdminAuth();
  const { isLive, refreshContent, settings } = useCMS();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const navItems = [
    { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard, color: '#18181B' },
    { to: '/admin/pages', label: 'Pages & Content', icon: FileText, color: '#18181B' },
    { to: '/admin/products', label: 'Products Catalog', icon: ShoppingBag, color: '#18181B' },
    { to: '/admin/services', label: 'Enterprise Services', icon: Layers, color: '#49243F' },
    { to: '/admin/portfolio', label: 'Case Studies', icon: Briefcase, color: '#49243F' },
    { to: '/admin/insights', label: 'Tech Insights', icon: BookOpen, color: '#18181B' },
    { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, color: '#49243F' },
    { to: '/admin/navigation', label: 'Navigation Menu', icon: Navigation, color: '#18181B' },
    { to: '/admin/inquiries', label: 'Inquiries Inbox', icon: Mail, color: '#18181B' },
    { to: '/admin/rfqs', label: 'Quote Requests (RFQ)', icon: FileSpreadsheet, color: '#49243F' },
    { to: '/admin/media', label: 'Media Library', icon: Image, color: '#18181B' },
    { to: '/admin/settings', label: 'Branding & Settings', icon: Settings, color: '#18181B' },
    { to: '/admin/audit-logs', label: 'Audit Trail', icon: History, color: '#E11D48' },
    ...(isSuperAdmin ? [{ to: '/admin/users', label: 'Team & Access', icon: Users, color: '#18181B' }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatus({ success: false, message: 'Password must be at least 8 characters' });
      return;
    }

    setIsChangingPass(true);
    setPasswordStatus(null);

    const token = localStorage.getItem('azaroth_cms_token');
    try {
      const res = await fetch('http://localhost:3001/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      setPasswordStatus(data);
      if (data.success) {
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordStatus(null);
        }, 1500);
      }
    } catch {
      setPasswordStatus({ success: false, message: 'Failed to connect to authentication server' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <CustomCursor />
      {/* Sidebar for Desktop */}
      <aside
        style={{
          width: '270px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
          boxShadow: '1px 0 3px rgba(0, 0, 0, 0.02)',
        }}
        className="hidden md:flex"
      >
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={settings?.logoUrl || logoImg} alt="Azaroth" style={{ height: '34px', maxWidth: '120px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
                Azaroth CMS
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                End-to-End Control
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  color: isActive ? '#18181B' : '#475569',
                  backgroundColor: isActive ? '#F4F4F5' : 'transparent',
                  border: isActive ? '1px solid #E4E4E7' : '1px solid transparent',
                  borderLeft: isActive ? '3px solid #18181B' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                })}
              >
                <Icon size={18} color={item.color} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Database Status & Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                backgroundColor: isLive ? '#ECFDF5' : '#FEF3C7',
                color: isLive ? '#047857' : '#B45309',
                border: `1px solid ${isLive ? '#A7F3D0' : '#FDE68A'}`,
              }}
            >
              <Database size={13} color={isLive ? '#047857' : '#D97706'} />
              {isLive ? 'Postgres Neon Live' : 'Local Fallback'}
            </span>
            <button
              onClick={() => refreshContent()}
              title="Refresh all CMS data"
              style={{
                background: 'none',
                border: 'none',
                color: '#18181B',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              Sync
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontSize: '0.75rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
            }}
          >
            <ExternalLink size={13} color="#18181B" /> View Live Website
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#F8FAFC' }}>
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(0.75rem, 2vw, 1.5rem)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            boxSizing: 'border-box',
            maxWidth: '100%',
          }}
        >
          {/* Mobile hamburger & environment status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 1.5vw, 1rem)', minWidth: 0 }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '0.25rem', flexShrink: 0 }}
              className="md:hidden"
              aria-label={mobileMenuOpen ? 'Close admin navigation' : 'Open admin navigation'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#047857', flexShrink: 0 }} />
              <span className="hidden sm:inline" style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>Production CMS Control</span>
            </div>
          </div>

          {/* User controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 1.5vw, 1rem)', flexShrink: 0 }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>{user?.name || 'Administrator'}</span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: user?.role === 'SUPER_ADMIN' ? '#18181B' : '#B45309',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {user?.role}
              </span>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              title="Change Password"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                color: '#475569',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <KeyRound size={16} color="#18181B" />
            </button>

            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                backgroundColor: '#FFE4E6',
                border: '1px solid #FECDD3',
                borderRadius: '8px',
                color: '#BE123C',
                padding: '0.5rem 0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                transition: 'background 0.15s ease',
              }}
            >
              <LogOut size={15} color="#E11D48" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FFFFFF',
              zIndex: 50,
              padding: '1.5rem',
              overflowY: 'auto',
              borderTop: '1px solid #E2E8F0',
            }}
            className="md:hidden"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 500,
                      textDecoration: 'none',
                      color: isActive ? '#18181B' : '#334155',
                      backgroundColor: isActive ? '#F4F4F5' : 'transparent',
                      border: isActive ? '1px solid #E4E4E7' : '1px solid transparent',
                    })}
                  >
                    <Icon size={20} color={item.color} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        {/* Sub-route Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '2rem',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {passwordStatus && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  backgroundColor: passwordStatus.success ? '#ECFDF5' : '#FFE4E6',
                  color: passwordStatus.success ? '#047857' : '#BE123C',
                  border: `1px solid ${passwordStatus.success ? '#A7F3D0' : '#FECDD3'}`,
                }}
              >
                {passwordStatus.message}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.625rem 0.75rem', color: '#0F172A', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.625rem 0.75rem', color: '#0F172A', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.625rem 0.75rem', color: '#0F172A', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{ padding: '0.625rem 1rem', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', cursor: 'pointer', fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', backgroundColor: '#18181B', border: '1px solid #09090B', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 6px rgba(24, 24, 27, 0.25)' }}
                >
                  {isChangingPass ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
