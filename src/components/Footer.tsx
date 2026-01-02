import { useTranslation } from 'react-i18next';
import '../styles/Footer.css';

const Footer = () => {
  const { i18n } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{i18n.language === 'bn' ? 'প্রতিদিনের সংবাদ' : 'Daily News'}</h3>
            <p>
              {i18n.language === 'bn' 
                ? 'বাংলাদেশের সর্বশেষ খবর এবং আপডেট' 
                : 'Latest news and updates from Bangladesh'}
            </p>
          </div>
          
          <div className="footer-section">
            <h4>{i18n.language === 'bn' ? 'যোগাযোগ' : 'Contact'}</h4>
            <p>Email: info@dailynews.com</p>
            <p>Phone: +880 1234-567890</p>
          </div>

          <div className="footer-section">
            <h4>{i18n.language === 'bn' ? 'অনুসরণ করুন' : 'Follow Us'}</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="YouTube">YouTube</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {i18n.language === 'bn' ? 'প্রতিদিনের সংবাদ। সর্বস্বত্ব সংরক্ষিত।' : 'Daily News. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
