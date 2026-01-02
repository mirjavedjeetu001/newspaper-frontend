import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { videoAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/VideosPage.css';

const VideosPage = () => {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await videoAPI.getAll();
        setVideos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="videos-page">
      <Header categories={[]} />
      
      <div className="videos-container">
        <h1 className="page-title">{t('videos')}</h1>
        
        <div className="videos-grid">
          {videos.map((video: any) => (
            <div key={video.id} className="video-item">
              {video.thumbnail ? (
                <img src={video.thumbnail} alt={i18n.language === 'bn' ? video.title_bn : video.title_en} className="video-thumbnail" />
              ) : (
                <video controls>
                  <source src={video.video_url} type="video/mp4" />
                </video>
              )}
              <h3 className="video-title">{i18n.language === 'bn' ? video.title_bn : video.title_en}</h3>
              {video.description_en && (
                <p className="video-description">
                  {i18n.language === 'bn' ? video.description_bn : video.description_en}
                </p>
              )}
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="no-data">{t('noData')}</div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default VideosPage;
