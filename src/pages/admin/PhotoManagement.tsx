import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { photoAPI } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

const PhotoManagement = () => {
  const { t, i18n } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_bn: '',
    image_url: '',
    description_en: '',
    description_bn: '',
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await photoAPI.getAll();
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPhoto) {
        await photoAPI.update(editingPhoto.id, formData);
      } else {
        await photoAPI.create(formData);
      }
      setShowForm(false);
      setEditingPhoto(null);
      resetForm();
      fetchPhotos();
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingPhoto(item);
    setFormData({
      title_en: item.title_en,
      title_bn: item.title_bn,
      image_url: item.image_url,
      description_en: item.description_en || '',
      description_bn: item.description_bn || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(i18n.language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      try {
        await photoAPI.delete(id);
        fetchPhotos();
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_bn: '',
      image_url: '',
      description_en: '',
      description_bn: '',
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="admin-header">
          <h1>{t('managePhotos')}</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => { setShowForm(!showForm); setEditingPhoto(null); resetForm(); }}
          >
            {showForm ? t('cancel') : t('addNew')}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingPhoto ? t('edit') : t('addNew')} Photo</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('title')} (English)</label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('title')} (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.title_bn}
                    onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('image')} URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Description (English)</label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Description (বাংলা)</label>
                  <textarea
                    value={formData.description_bn}
                    onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{t('save')}</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setShowForm(false); setEditingPhoto(null); resetForm(); }}
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
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {photos.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td><img src={item.image_url} alt="" style={{width: '60px', height: '40px', objectFit: 'cover'}} /></td>
                  <td>{i18n.language === 'bn' ? item.title_bn : item.title_en}</td>
                  <td>
                    <button className="btn btn-sm btn-edit" onClick={() => handleEdit(item)}>{t('edit')}</button>
                    <button className="btn btn-sm btn-delete" onClick={() => handleDelete(item.id)}>{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {photos.length === 0 && <div className="no-data">{t('noData')}</div>}
        </div>
      </main>
    </div>
  );
};

export default PhotoManagement;
