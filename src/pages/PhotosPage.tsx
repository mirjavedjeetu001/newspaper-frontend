import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { photoAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PhotosPage.css';

const PhotosPage = () => {
  const { t, i18n } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await photoAPI.getAll();
        setPhotos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="photos-page">
      <Header categories={[]} />
      
      <div className="photos-container">
        <h1 className="page-title">{t('photos')}</h1>
        
        <div className="photos-grid">
          {photos.map((photo: any) => (
            <div key={photo.id} className="photo-item">
              <img src={photo.image_url} alt={i18n.language === 'bn' ? photo.title_bn : photo.title_en} />
              <div className="photo-overlay">
                <h3>{i18n.language === 'bn' ? photo.title_bn : photo.title_en}</h3>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="no-data">{t('noData')}</div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PhotosPage;
