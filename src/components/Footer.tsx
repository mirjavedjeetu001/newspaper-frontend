import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { settingsAPI, categoryAPI } from '../services/api';
import '../styles/Footer.css';

const Footer = () => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, categoriesRes] = await Promise.all([
          settingsAPI.get(),
          categoryAPI.getAll()
        ]);
        
        setSettings(settingsRes.data);
        setCategories(categoriesRes.data.slice(0, 6));
        
        // Parse footer links from JSON if available
        let parsedFooterData = {
          quickLinks: [
            { label_en: 'About Us', label_bn: 'আমাদের সম্পর্কে', url: '/about' },
            { label_en: 'Contact', label_bn: 'যোগাযোগ', url: '/contact' },
            { label_en: 'Privacy Policy', label_bn: 'গোপনীয়তা নীতি', url: '/privacy' },
            { label_en: 'Terms & Conditions', label_bn: 'শর্তাবলী', url: '/terms' },
          ]
        };
        
        if (settingsRes.data.footer_links) {
          try {
            const parsed = JSON.parse(settingsRes.data.footer_links);
            parsedFooterData = { ...parsedFooterData, ...parsed };
          } catch (e) {
            console.log('Using default footer links');
          }
        }
        
        setFooterData(parsedFooterData);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };
    
    fetchData();
  }, []);

  if (!settings || !footerData) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section footer-about">
            <h3>{i18n.language === 'bn' ? settings.site_name_bn : settings.site_name_en}</h3>
            <p>
              {i18n.language === 'bn' 
                ? (settings.footer_about_bn || settings.description_bn || 'সাতক্ষীরা এবং এর আশেপাশের খবর এবং তথ্যের জন্য আপনার বিশ্বস্ত উৎস।')
                : (settings.footer_about_en || settings.description_en || 'Your trusted source for news and information from Satkhira and beyond.')}
            </p>
            <div className="social-links">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="social-icon">
                  <span>📘</span>
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="social-icon">
                  <span>🐦</span>
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="social-icon">
                  <span>📺</span>
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="social-icon">
                  <span>📷</span>
                </a>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-section">
            <h4>{i18n.language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}</h4>
            <ul className="footer-links">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.url}>
                    {i18n.language === 'bn' ? link.label_bn : link.label_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>{i18n.language === 'bn' ? 'বিভাগসমূহ' : 'Categories'}</h4>
            <ul className="footer-links">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/category/${category.slug}`}>
                    {i18n.language === 'bn' ? category.name_bn : category.name_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>{i18n.language === 'bn' ? 'যোগাযোগ' : 'Contact Us'}</h4>
            <ul className="footer-contact">
              <li>
                <strong>{i18n.language === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong><br />
                {i18n.language === 'bn' ? settings.address_bn : settings.address_en}
              </li>
              {settings.contact_phone && (
                <li>
                  <strong>{i18n.language === 'bn' ? 'ফোন:' : 'Phone:'}</strong><br />
                  <a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>
                </li>
              )}
              {settings.contact_email && (
                <li>
                  <strong>{i18n.language === 'bn' ? 'ইমেইল:' : 'Email:'}</strong><br />
                  <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} 
            {i18n.language === 'bn' ? ' সাতক্ষীরা জার্নাল। সর্বস্বত্ব সংরক্ষিত।' : ' Satkhira Journal. All rights reserved.'}
          </p>
          <p className="footer-credit">
            {i18n.language === 'bn' ? 'ডিজাইন এবং উন্নয়ন: ' : 'Designed & Developed by: '}
            <span className="highlight">Tech Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
