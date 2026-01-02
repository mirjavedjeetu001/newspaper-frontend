import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import '../../styles/Admin.css';

interface Menu {
  id?: number;
  title_en: string;
  title_bn: string;
  url: string;
  location: string;
  order: number;
  icon: string;
  parent_id: number | null;
  is_active: boolean;
  open_new_tab: boolean;
}

const MenuManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Menu>({
    title_en: '',
    title_bn: '',
    url: '',
    location: 'header',
    order: 0,
    icon: '',
    parent_id: null,
    is_active: true,
    open_new_tab: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/menus`);
      setMenus(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/menus/${editingId}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/menus`, formData);
      }
      fetchMenus();
      resetForm();
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  };

  const handleEdit = (menu: Menu) => {
    setFormData(menu);
    setEditingId(menu.id!);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(i18n.language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/menus/${id}`);
        fetchMenus();
      } catch (error) {
        console.error('Error deleting menu:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_bn: '',
      url: '',
      location: 'header',
      order: 0,
      icon: '',
      parent_id: null,
      is_active: true,
      open_new_tab: false,
    });
    setEditingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar onLogout={handleLogout} />
        <div className="admin-content">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      <div className="admin-content">
        <div className="admin-header">
          <h1>{i18n.language === 'bn' ? 'মেনু পরিচালনা' : 'Menu Management'}</h1>
        </div>

        <div className="admin-form-card">
          <h2>{editingId ? (i18n.language === 'bn' ? 'মেনু সম্পাদনা' : 'Edit Menu') : (i18n.language === 'bn' ? 'নতুন মেনু যোগ করুন' : 'Add New Menu')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{i18n.language === 'bn' ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'}</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{i18n.language === 'bn' ? 'শিরোনাম (বাংলা)' : 'Title (Bangla)'}</label>
                <input
                  type="text"
                  value={formData.title_bn}
                  onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{i18n.language === 'bn' ? 'URL' : 'URL'}</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/category/sports or https://example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>{i18n.language === 'bn' ? 'আইকন (ঐচ্ছিক)' : 'Icon (Optional)'}</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📰 or fa-home"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{i18n.language === 'bn' ? 'অবস্থান' : 'Location'}</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="header">{i18n.language === 'bn' ? 'হেডার' : 'Header'}</option>
                  <option value="footer">{i18n.language === 'bn' ? 'ফুটার' : 'Footer'}</option>
                  <option value="both">{i18n.language === 'bn' ? 'উভয়' : 'Both'}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{i18n.language === 'bn' ? 'ক্রম' : 'Order'}</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  {' '}{i18n.language === 'bn' ? 'সক্রিয়' : 'Active'}
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.open_new_tab}
                    onChange={(e) => setFormData({ ...formData, open_new_tab: e.target.checked })}
                  />
                  {' '}{i18n.language === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in New Tab'}
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? t('save') : t('addNew')}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-secondary">
                  {t('cancel')}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-table-card">
          <h2>{i18n.language === 'bn' ? 'সকল মেনু' : 'All Menus'}</h2>
          {menus.length === 0 ? (
            <p className="no-data">{t('noData')}</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{i18n.language === 'bn' ? 'ক্রম' : 'Order'}</th>
                  <th>{i18n.language === 'bn' ? 'শিরোনাম' : 'Title'}</th>
                  <th>URL</th>
                  <th>{i18n.language === 'bn' ? 'অবস্থান' : 'Location'}</th>
                  <th>{i18n.language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id}>
                    <td>{menu.order}</td>
                    <td>
                      {menu.icon && <span>{menu.icon} </span>}
                      {i18n.language === 'bn' ? menu.title_bn : menu.title_en}
                    </td>
                    <td>{menu.url}</td>
                    <td>
                      <span className="badge">
                        {menu.location === 'header' ? (i18n.language === 'bn' ? 'হেডার' : 'Header') : 
                         menu.location === 'footer' ? (i18n.language === 'bn' ? 'ফুটার' : 'Footer') : 
                         (i18n.language === 'bn' ? 'উভয়' : 'Both')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${menu.is_active ? 'badge-success' : 'badge-secondary'}`}>
                        {menu.is_active ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(menu)} className="btn-edit">
                        {t('edit')}
                      </button>
                      <button onClick={() => handleDelete(menu.id!)} className="btn-delete">
                        {t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
