// src/pages/admin/AdminNavigationManager.tsx
import React, { useState } from 'react';
import {
  Navigation,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Edit2,
  X
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { NavigationItem } from '../../services/cmsService';
import { adminColors } from '../../styles/adminTheme';

export const AdminNavigationManager: React.FC = () => {
  const { navigation, saveNavItem, deleteNavItem, reorderNavItems, toggleModule, settings } = useCMS();
  const [notification, setNotification] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleVisible = async (item: NavigationItem) => {
    try {
      const nextState = !item.isVisible;
      await saveNavItem({ ...item, isVisible: nextState });

      // If this corresponds to a standard module, keep module setting in sync
      const matchingMod = settings.modulesConfig?.find((m) => m.path === item.path);
      if (matchingMod) {
        await toggleModule(matchingMod.slug, nextState);
      }

      setNotification(`Navigation link "${item.label}" is now ${nextState ? 'Visible' : 'Hidden'}.`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(`Toggle failed: ${err.message}`);
    }
  };

  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return;
    await reorderNavItems(idx, idx - 1);
    setNotification('Navigation order updated.');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleMoveDown = async (idx: number) => {
    if (idx >= navigation.length - 1) return;
    await reorderNavItems(idx, idx + 1);
    setNotification('Navigation order updated.');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleOpenAdd = () => {
    setEditingItem({
      label: '',
      path: '/',
      order: navigation.length + 1,
      isVisible: true,
      isExternal: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NavigationItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.label || !editingItem?.path) {
      alert('Label and path are required.');
      return;
    }

    try {
      await saveNavItem(editingItem);
      setIsModalOpen(false);
      setEditingItem(null);
      setNotification(`Navigation link "${editingItem.label}" saved successfully.`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(`Error saving navigation item: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (window.confirm(`Permanently remove navigation link "${label}"?`)) {
      try {
        await deleteNavItem(id);
        setNotification(`Removed "${label}".`);
        setTimeout(() => setNotification(null), 3000);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: adminColors.indigo.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={22} color={adminColors.indigo.text} />
            </div>
            Header & Footer Navigation Bar Links
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.375rem', marginLeft: '3.25rem' }}>
            Manage the top navigation menu links, order, and visibility. Disabled links remain editable here and can always be re-enabled.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: '#18181B',
            border: '1px solid #09090B',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(24, 24, 27, 0.22)',
          }}
        >
          <Plus size={18} /> Add Nav Item
        </button>
      </div>

      {notification && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', color: '#047857', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Navigation Items List */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {navigation.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === navigation.length - 1;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: item.isVisible ? '#F8FAFC' : '#FFFBEB',
                  borderRadius: '10px',
                  border: `1px solid ${item.isVisible ? '#E2E8F0' : '#FED7AA'}`,
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                {/* Left: Reorder arrows & Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveUp(idx)}
                      disabled={isFirst}
                      style={{
                        padding: '0.2rem',
                        borderRadius: '4px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: isFirst ? '#F1F5F9' : '#FFFFFF',
                        color: isFirst ? '#94A3B8' : '#334155',
                        cursor: isFirst ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(idx)}
                      disabled={isLast}
                      style={{
                        padding: '0.2rem',
                        borderRadius: '4px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: isLast ? '#F1F5F9' : '#FFFFFF',
                        color: isLast ? '#94A3B8' : '#334155',
                        cursor: isLast ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#18181B', width: '26px' }}>
                    #{idx + 1}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A' }}>
                        {item.label}
                      </span>
                      {item.isExternal && (
                        <span style={{ fontSize: '0.6875rem', padding: '0.15rem 0.4rem', backgroundColor: '#F4F4F5', color: '#18181B', borderRadius: '4px', fontWeight: 600 }}>
                          External
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                      {item.path}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleVisible(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: `1px solid ${item.isVisible ? '#A7F3D0' : '#FDE68A'}`,
                      backgroundColor: item.isVisible ? '#ECFDF5' : '#FEF3C7',
                      color: item.isVisible ? '#047857' : '#B45309',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title={item.isVisible ? 'Click to hide from website nav' : 'Click to make visible in website nav'}
                  >
                    {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span>{item.isVisible ? 'Visible' : 'Disabled (Hidden)'}</span>
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: '#EEF2FF',
                      border: '1px solid #C7D2FE',
                      color: '#4338CA',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    title="Edit Link"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.label)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.45rem',
                      borderRadius: '6px',
                      backgroundColor: '#FFE4E6',
                      border: '1px solid #FECDD3',
                      color: '#BE123C',
                      cursor: 'pointer',
                    }}
                    title="Delete link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
              borderRadius: '14px',
              width: '100%',
              maxWidth: '500px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
                {editingItem.id ? 'Edit Navigation Link' : 'Add Navigation Link'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Link Display Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Our Products"
                  value={editingItem.label || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Route Path or External URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /products or https://example.com"
                  value={editingItem.path || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, path: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#1E293B' }}>
                  <input
                    type="checkbox"
                    checked={editingItem.isVisible ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                  />
                  <span>Show in navigation menu (Visible)</span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#1E293B' }}>
                  <input
                    type="checkbox"
                    checked={editingItem.isExternal ?? false}
                    onChange={(e) => setEditingItem({ ...editingItem, isExternal: e.target.checked })}
                  />
                  <span>External link (opens in new tab)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#18181B', color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
