import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { newsAPI, categoryAPI } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/Admin.css';

const NewsManagement = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_bn: '',
    content_en: '',
    content_bn: '',
    image: '',
    video_url: '',
    category: '',
    is_breaking: false,
    is_featured: false,
    is_trending: false,
  });

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await newsAPI.update(editingNews.id, formData);
      } else {
        await newsAPI.create(formData);
      }
      setShowForm(false);
      setEditingNews(null);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingNews(item);
    setFormData({
      title_en: item.title_en,
      title_bn: item.title_bn,
      content_en: item.content_en,
      content_bn: item.content_bn,
      image: item.image || '',
      video_url: item.video_url || '',
      category: item.category?.id || '',
      is_breaking: item.is_breaking,
      is_featured: item.is_featured,
      is_trending: item.is_trending,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(i18n.language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      try {
        await newsAPI.delete(id);
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_bn: '',
      content_en: '',
      content_bn: '',
      image: '',
      video_url: '',
      category: '',
      is_breaking: false,
      is_featured: false,
      is_trending: false,
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="admin-header">
          <h1>{t('manageNews')}</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => { setShowForm(!showForm); setEditingNews(null); resetForm(); }}
          >
            {showForm ? t('cancel') : t('addNew')}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingNews ? t('edit') : t('addNew')} {t('news')}</h2>
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
                  <label>{t('content')} (English)</label>
                  <textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    rows={5}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('content')} (বাংলা)</label>
                  <textarea
                    value={formData.content_bn}
                    onChange={(e) => setFormData({ ...formData, content_bn: e.target.value })}
                    rows={5}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {i18n.language === 'bn' ? cat.name_bn : cat.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('image')} URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('video')} URL</label>
                  <input
                    type="text"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_breaking}
                      onChange={(e) => setFormData({ ...formData, is_breaking: e.target.checked })}
                    />
                    {t('breaking')}
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    {t('featured')}
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_trending}
                      onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                    />
                    {t('trending')}
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{t('save')}</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setShowForm(false); setEditingNews(null); resetForm(); }}
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
                <th>{t('title')}</th>
                <th>{t('category')}</th>
                <th>{t('status')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{i18n.language === 'bn' ? item.title_bn : item.title_en}</td>
                  <td>{item.category && (i18n.language === 'bn' ? item.category.name_bn : item.category.name_en)}</td>
                  <td>
                    {item.is_breaking && <span className="badge badge-danger">Breaking</span>}
                    {item.is_featured && <span className="badge badge-primary">Featured</span>}
                    {item.is_trending && <span className="badge badge-success">Trending</span>}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-edit" onClick={() => handleEdit(item)}>{t('edit')}</button>
                    <button className="btn btn-sm btn-delete" onClick={() => handleDelete(item.id)}>{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {news.length === 0 && <div className="no-data">{t('noData')}</div>}
        </div>
      </main>
    </div>
  );
};

export default NewsManagement;
