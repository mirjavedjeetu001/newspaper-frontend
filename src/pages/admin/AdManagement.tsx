import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adAPI } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdManagement = () => {
  const { t, i18n } = useTranslation();
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    position: 'header',
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await adAPI.getAll();
      setAds(response.data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAd) {
        await adAPI.update(editingAd.id, formData);
      } else {
        await adAPI.create(formData);
      }
      setShowForm(false);
      setEditingAd(null);
      resetForm();
      fetchAds();
    } catch (error) {
      console.error('Error saving ad:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingAd(item);
    setFormData({
      title: item.title,
      image_url: item.image_url,
      link_url: item.link_url || '',
      position: item.position,
      order: item.order,
      is_active: item.is_active !== undefined ? item.is_active : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(i18n.language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      try {
        await adAPI.delete(id);
        fetchAds();
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      link_url: '',
      position: 'header',
      order: 0,
      is_active: true,
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="admin-header">
          <h1>{t('manageAds')}</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => { setShowForm(!showForm); setEditingAd(null); resetForm(); }}
          >
            {showForm ? t('cancel') : t('addNew')}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingAd ? t('edit') : t('addNew')} Advertisement</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('title')}</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  >
                    <option value="header">Header (Top of page)</option>
                    <option value="sidebar">Sidebar (Right side)</option>
                    <option value="footer">Footer (Bottom of page)</option>
                    <option value="between-news">Between News</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('image')} URL</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Link URL</label>
                  <input
                    type="text"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    Active (Show on website)
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{t('save')}</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setShowForm(false); setEditingAd(null); resetForm(); }}
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>{t('title')}</th>
                <th>Position</th>
                <th>Order</th>
                <th>Status</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td><img src={item.image_url} alt="" style={{width: '80px', height: '40px', objectFit: 'cover'}} /></td>
                  <td>{item.title}</td>
                  <td><span className="badge badge-info">{item.position}</span></td>
                  <td>{item.order}</td>
                  <td>
                    <span className={`badge ${item.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-edit" onClick={() => handleEdit(item)}>{t('edit')}</button>
                    <button className="btn btn-sm btn-delete" onClick={() => handleDelete(item.id)}>{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ads.length === 0 && <div className="no-data">{t('noData')}</div>}
        </div>
      </main>
    </div>
  );
};

export default AdManagement;
