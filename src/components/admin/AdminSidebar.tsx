import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AdminSidebarProps {
  onLogout: () => void;
}

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'bn' ? 'en' : 'bn';
    i18n.changeLanguage(newLang);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <h2>{t('admin')}</h2>
      </div>
      <nav className="admin-nav">
        <Link to="/admin" className="admin-nav-item">{t('dashboard')}</Link>
        <Link to="/admin/news" className="admin-nav-item">{t('manageNews')}</Link>
        <Link to="/admin/categories" className="admin-nav-item">{t('manageCategories')}</Link>
        <Link to="/admin/photos" className="admin-nav-item">{t('managePhotos')}</Link>
        <Link to="/admin/videos" className="admin-nav-item">{t('manageVideos')}</Link>
        <Link to="/admin/ads" className="admin-nav-item">{t('manageAds')}</Link>
        <Link to="/admin/menus" className="admin-nav-item">{i18n.language === 'bn' ? 'মেনু পরিচালনা' : 'Manage Menus'}</Link>
        <Link to="/admin/users" className="admin-nav-item">{i18n.language === 'bn' ? 'ব্যবহারকারী পরিচালনা' : 'Manage Users'}</Link>
        <Link to="/admin/roles" className="admin-nav-item">{i18n.language === 'bn' ? 'ভূমিকা পরিচালনা' : 'Manage Roles'}</Link>
        <Link to="/admin/districts" className="admin-nav-item">{i18n.language === 'bn' ? 'জেলা পরিচালনা' : 'Manage Districts'}</Link>
        <Link to="/admin/settings" className="admin-nav-item">{t('siteSettings')}</Link>
      </nav>
      <div className="admin-footer">
        <button onClick={toggleLanguage} className="lang-btn">
          {i18n.language === 'bn' ? 'English' : 'বাংলা'}
        </button>
        <Link to="/" className="back-link">← {t('home')}</Link>
        <button onClick={onLogout} className="logout-btn">{t('logout')}</button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
