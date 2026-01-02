import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { newsAPI, categoryAPI, photoAPI, videoAPI, settingsAPI } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BreakingNews from '../components/BreakingNews';
import FeaturedNews from '../components/FeaturedNews';
import TrendingNews from '../components/TrendingNews';
import PhotoGallery from '../components/PhotoGallery';
import VideoGallery from '../components/VideoGallery';
import AdBanner from '../components/AdBanner';
import '../styles/HomePage.css';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [breakingNews, setBreakingNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Set document title
  useDocumentTitle(
    settings 
      ? (i18n.language === 'bn' ? settings.site_name_bn : settings.site_name_en)
      : undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [breakingRes, featuredRes, trendingRes, categoriesRes, photosRes, videosRes, settingsRes] = await Promise.all([
          newsAPI.getBreaking(),
          newsAPI.getFeatured(),
          newsAPI.getTrending(),
          categoryAPI.getAll(),
          photoAPI.getAll(),
          videoAPI.getAll(),
          settingsAPI.get(),
        ]);

        setBreakingNews(breakingRes.data);
        setFeaturedNews(featuredRes.data);
        setTrendingNews(trendingRes.data);
        setCategories(categoriesRes.data);
        setPhotos(photosRes.data.slice(0, 6));
        setVideos(videosRes.data.slice(0, 6));
        setSettings(settingsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{i18n.language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header categories={categories} />
      
      <AdBanner position="header" />
      
      <BreakingNews news={breakingNews} />

      <div className="main-container">
        <div className="content-area">
          <FeaturedNews news={featuredNews} />
          
          <AdBanner position="between-news" />
          
          <section className="section">
            <h2 className="section-title">{t('photos')}</h2>
            <PhotoGallery photos={photos} />
          </section>

          <section className="section">
            <h2 className="section-title">{t('videos')}</h2>
            <VideoGallery videos={videos} />
          </section>
        </div>

        <aside className="sidebar">
          <TrendingNews news={trendingNews} />
          <AdBanner position="sidebar" />
        </aside>
      </div>

      <AdBanner position="footer" />
      
      <Footer />
    </div>
  );
};

export default HomePage;
