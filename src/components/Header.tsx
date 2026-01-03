import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { settingsAPI } from '../services/api';
import '../styles/Header.css';

interface HeaderProps {
  categories: any[];
}

interface Settings {
  site_name_en: string;
  site_name_bn: string;
  logo_url?: string;
}

interface Menu {
  id: number;
  title_en: string;
  title_bn: string;
  url: string;
  icon?: string;
  order: number;
  is_active: boolean;
  open_new_tab: boolean;
}

const Header = ({ categories }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.get();
        setSettings(response.data);
        // Apply theme color as CSS variable and store in localStorage
        if (response.data.theme_color) {
          document.documentElement.style.setProperty('--theme-color', response.data.theme_color);
          localStorage.setItem('theme_color', response.data.theme_color);
        }
        // Update document title
        const siteName = i18n.language === 'bn' ? response.data.site_name_bn : response.data.site_name_en;
        if (siteName) {
          document.title = siteName;
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [i18n.language]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/menus?location=header');
        setMenus(response.data.filter((menu: Menu) => menu.is_active));
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'bn' ? 'en' : 'bn';
    i18n.changeLanguage(newLang);
  };

  const siteName = settings 
    ? (i18n.language === 'bn' ? settings.site_name_bn : settings.site_name_en)
    : (i18n.language === 'bn' ? 'প্রতিদিনের সংবাদ' : 'Daily News');

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="date-time">
              {new Date().toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="header-actions">
              <button onClick={toggleLanguage} className="lang-btn">
                {i18n.language === 'bn' ? 'English' : 'বাংলা'}
              </button>
              <Link to="/login" className="admin-link">{t('admin')}</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="header-middle">
        <div className="container">
          <Link to="/" className="logo">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={siteName} className="logo-image" />
            ) : (
              <h1>{siteName}</h1>
            )}
          </Link>
        </div>
      </div>

      <nav className={`header-nav ${isSticky ? 'sticky' : ''}`}>
        <div className="container">
          {isMobileMenuOpen && (
            <div 
              className="menu-overlay" 
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
          </button>
          <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            {menus.length > 0 ? (
              menus.map((menu) => (
                <li key={menu.id}>
                  <Link 
                    to={menu.url}
                    target={menu.open_new_tab ? '_blank' : '_self'}
                    rel={menu.open_new_tab ? 'noopener noreferrer' : undefined}
                  >
                    {menu.icon && <span style={{ marginRight: '5px' }}>{menu.icon}</span>}
                    {i18n.language === 'bn' ? menu.title_bn : menu.title_en}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><Link to="/">{t('home')}</Link></li>
                {categories.filter(cat => cat.show_in_menu !== false).map((category) => (
                  <li key={category.id}>
                    <Link to={`/category/${category.slug}`}>
                      {i18n.language === 'bn' ? category.name_bn : category.name_en}
                    </Link>
                  </li>
                ))}
                <li><Link to="/photos">{t('photos')}</Link></li>
                <li><Link to="/videos">{t('videos')}</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
