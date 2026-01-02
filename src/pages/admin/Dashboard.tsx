import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { newsAPI, categoryAPI, photoAPI, videoAPI, adAPI } from '../../services/api';
import '../../styles/Admin.css';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    news: 0,
    categories: 0,
    photos: 0,
    videos: 0,
    ads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, categoriesRes, photosRes, videosRes, adsRes] = await Promise.all([
        newsAPI.getAll(),
        categoryAPI.getAll(),
        photoAPI.getAll(),
        videoAPI.getAll(),
        adAPI.getAll(),
      ]);

      setStats({
        news: newsRes.data.length,
        categories: categoriesRes.data.length,
        photos: photosRes.data.length,
        videos: videosRes.data.length,
        ads: adsRes.data.length,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
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
        <main className="admin-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />

      <main className="admin-content">
        <div className="admin-header">
          <div>
            <h1>{t('dashboard')}</h1>
            <p className="admin-subtitle">
              {i18n.language === 'bn' ? 'স্বাগতম! আপনার সাইট পরিচালনা করুন' : 'Welcome! Manage your website'}
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-news">
            <div className="stat-icon">📰</div>
            <div className="stat-content">
              <h3>{stats.news}</h3>
              <p>{t('news')}</p>
            </div>
            <Link to="/admin/news" className="stat-link">{t('viewAll')} →</Link>
          </div>

          <div className="stat-card stat-categories">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <h3>{stats.categories}</h3>
              <p>{t('categories')}</p>
            </div>
            <Link to="/admin/categories" className="stat-link">{t('viewAll')} →</Link>
          </div>

          <div className="stat-card stat-photos">
            <div className="stat-icon">📷</div>
            <div className="stat-content">
              <h3>{stats.photos}</h3>
              <p>{t('photos')}</p>
            </div>
            <Link to="/admin/photos" className="stat-link">{t('viewAll')} →</Link>
          </div>

          <div className="stat-card stat-videos">
            <div className="stat-icon">🎥</div>
            <div className="stat-content">
              <h3>{stats.videos}</h3>
              <p>{t('videos')}</p>
            </div>
            <Link to="/admin/videos" className="stat-link">{t('viewAll')} →</Link>
          </div>

          <div className="stat-card stat-ads">
            <div className="stat-icon">📢</div>
            <div className="stat-content">
              <h3>{stats.ads}</h3>
              <p>{i18n.language === 'bn' ? 'বিজ্ঞাপন' : 'Advertisements'}</p>
            </div>
            <Link to="/admin/ads" className="stat-link">{t('viewAll')} →</Link>
          </div>
        </div>

        <div className="dashboard-actions">
          <div className="action-card">
            <h3>🚀 {i18n.language === 'bn' ? 'দ্রুত কাজ' : 'Quick Actions'}</h3>
            <div className="action-buttons">
              <Link to="/admin/news" className="action-btn">
                <span>➕</span>
                {i18n.language === 'bn' ? 'নতুন খবর যোগ করুন' : 'Add New Article'}
              </Link>
              <Link to="/admin/categories" className="action-btn">
                <span>📂</span>
                {i18n.language === 'bn' ? 'নতুন বিভাগ' : 'New Category'}
              </Link>
              <Link to="/admin/settings" className="action-btn">
                <span>⚙️</span>
                {i18n.language === 'bn' ? 'সাইট সেটিংস' : 'Site Settings'}
              </Link>
            </div>
          </div>

          <div className="action-card">
            <h3>📊 {i18n.language === 'bn' ? 'সাম্প্রতিক কার্যকলাপ' : 'Recent Activity'}</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">📝</span>
                <div>
                  <p className="activity-title">{i18n.language === 'bn' ? 'মোট খবর প্রকাশিত' : 'Total News Published'}</p>
                  <p className="activity-time">{stats.news} {i18n.language === 'bn' ? 'টি নিবন্ধ' : 'articles'}</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">📁</span>
                <div>
                  <p className="activity-title">{i18n.language === 'bn' ? 'সক্রিয় বিভাগ' : 'Active Categories'}</p>
                  <p className="activity-time">{stats.categories} {i18n.language === 'bn' ? 'টি বিভাগ' : 'categories'}</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">🖼️</span>
                <div>
                  <p className="activity-title">{i18n.language === 'bn' ? 'মিডিয়া আইটেম' : 'Media Items'}</p>
                  <p className="activity-time">{stats.photos + stats.videos} {i18n.language === 'bn' ? 'টি ফাইল' : 'files'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
