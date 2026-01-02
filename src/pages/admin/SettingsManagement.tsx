import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import '../../styles/Admin.css';

interface Settings {
  id?: number;
  site_name_en: string;
  site_name_bn: string;
  logo_url: string;
  favicon_url: string;
  description_en: string;
  description_bn: string;
  contact_email: string;
  contact_phone: string;
  address_en: string;
  address_bn: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  instagram_url: string;
}

const SettingsManagement: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    site_name_en: '',
    site_name_bn: '',
    logo_url: '',
    favicon_url: '',
    description_en: '',
    description_bn: '',
    contact_email: '',
    contact_phone: '',
    address_en: '',
    address_bn: '',
    facebook_url: '',
    twitter_url: '',
    youtube_url: '',
    instagram_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/settings`);
      if (response.data) {
        setSettings(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/settings`, settings);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating settings');
    } finally {
      setSaving(false);
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
          <h1>{t('siteSettings')}</h1>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-section">
              <h3>{t('basicInfo')}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('siteNameEnglish')}</label>
                  <input
                    type="text"
                    name="site_name_en"
                    value={settings.site_name_en}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('siteNameBangla')}</label>
                  <input
                    type="text"
                    name="site_name_bn"
                    value={settings.site_name_bn}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('logoUrl')}</label>
                  <input
                    type="text"
                    name="logo_url"
                    value={settings.logo_url}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="form-group">
                  <label>{t('faviconUrl')}</label>
                  <input
                    type="text"
                    name="favicon_url"
                    value={settings.favicon_url}
                    onChange={handleChange}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('descriptionEnglish')}</label>
                  <textarea
                    name="description_en"
                    value={settings.description_en}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>{t('descriptionBangla')}</label>
                  <textarea
                    name="description_bn"
                    value={settings.description_bn}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>{t('contactInfo')}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('email')}</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={settings.contact_email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('phone')}</label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={settings.contact_phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('addressEnglish')}</label>
                  <input
                    type="text"
                    name="address_en"
                    value={settings.address_en}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('addressBangla')}</label>
                  <input
                    type="text"
                    name="address_bn"
                    value={settings.address_bn}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>{t('socialMedia')}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('facebook')}</label>
                  <input
                    type="text"
                    name="facebook_url"
                    value={settings.facebook_url}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="form-group">
                  <label>{t('twitter')}</label>
                  <input
                    type="text"
                    name="twitter_url"
                    value={settings.twitter_url}
                    onChange={handleChange}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('youtube')}</label>
                  <input
                    type="text"
                    name="youtube_url"
                    value={settings.youtube_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
                <div className="form-group">
                  <label>{t('instagram')}</label>
                  <input
                    type="text"
                    name="instagram_url"
                    value={settings.instagram_url}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? t('saving') : t('saveSettings')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
