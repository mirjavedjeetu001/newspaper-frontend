import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { videoAPI } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

const VideoManagement = () => {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_bn: '',
    video_url: '',
    thumbnail: '',
    description_en: '',
    description_bn: '',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await videoAPI.getAll();
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        await videoAPI.update(editingVideo.id, formData);
      } else {
        await videoAPI.create(formData);
      }
      setShowForm(false);
      setEditingVideo(null);
      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingVideo(item);
    setFormData({
      title_en: item.title_en,
      title_bn: item.title_bn,
      video_url: item.video_url,
      thumbnail: item.thumbnail || '',
      description_en: item.description_en || '',
      description_bn: item.description_bn || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(i18n.language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      try {
        await videoAPI.delete(id);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_bn: '',
      video_url: '',
      thumbnail: '',
      description_en: '',
      description_bn: '',
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="admin-header">
          <h1>{t('manageVideos')}</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => { setShowForm(!showForm); setEditingVideo(null); resetForm(); }}
          >
            {showForm ? t('cancel') : t('addNew')}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingVideo ? t('edit') : t('addNew')} Video</h2>
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

              <div className="form-row">
                <div className="form-group">
                  <label>Video URL</label>
                  <input
                    type="text"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                </div>
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
                  onClick={() => { setShowForm(false); setEditingVideo(null); resetForm(); }}
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
                <th>Thumbnail</th>
                <th>{t('title')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" style={{width: '60px', height: '40px', objectFit: 'cover'}} />
                    ) : (
                      <span>No thumbnail</span>
                    )}
                  </td>
                  <td>{i18n.language === 'bn' ? item.title_bn : item.title_en}</td>
                  <td>
                    <button className="btn btn-sm btn-edit" onClick={() => handleEdit(item)}>{t('edit')}</button>
                    <button className="btn btn-sm btn-delete" onClick={() => handleDelete(item.id)}>{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {videos.length === 0 && <div className="no-data">{t('noData')}</div>}
        </div>
      </main>
    </div>
  );
};

export default VideoManagement;
