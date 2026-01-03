import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { newsAPI, categoryAPI, photoAPI, videoAPI, settingsAPI } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BreakingNews from '../components/BreakingNews';
import MainNewsGrid from '../components/MainNewsGrid';
import CategorySidebar from '../components/CategorySidebar';
import PhotoGallery from '../components/PhotoGallery';
import VideoGallery from '../components/VideoGallery';
import AdBanner from '../components/AdBanner';
import SearchBox from '../components/SearchBox';
import BanglaDateTime from '../components/BanglaDateTime';
import SatkhiraInfo from '../components/SatkhiraInfo';
import '../styles/HomePage.css';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [breakingNews, setBreakingNews] = useState([]);
  const [allNews, setAllNews] = useState([]);
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
        const [breakingRes, allNewsRes, categoriesRes, photosRes, videosRes, settingsRes] = await Promise.all([
          newsAPI.getBreaking(),
          newsAPI.getAll(),
          categoryAPI.getAll(),
          photoAPI.getAll(),
          videoAPI.getAll(),
          settingsAPI.get(),
        ]);

        setBreakingNews(breakingRes.data);
        
        // Sort news: items with images first
        const sortedNews = [...allNewsRes.data].sort((a, b) => {
          if (a.image && !b.image) return -1;
          if (!a.image && b.image) return 1;
          return 0;
        });
        
        setAllNews(sortedNews);
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
      
      <BreakingNews news={breakingNews} />

      <div className="container homepage-container">
        <div className="main-content">
          <AdBanner position="header" />
          
          {/* Main News Grid - Like protidinersangbad.com */}
          <MainNewsGrid news={allNews.slice(0, 9)} />
          
          {/* More News Sections - Show all remaining news dynamically */}
          {allNews.length > 9 && (
            <div className="more-news-section">
              <h2 className="section-title">
                {i18n.language === 'bn' ? 'আরও খবর' : 'More News'}
              </h2>
              <div className="more-news-grid">
                {allNews.slice(9).map((news: any) => (
                  <Link key={news.id} to={`/news/${news.slug}`} className="more-news-card">
                    <div className="more-news-image">
                      <img 
                        src={news.image || 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image'} 
                        alt={i18n.language === 'bn' ? news.title_bn : news.title_en}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="more-news-content">
                      {news.category && (
                        <span className="news-category-tag">
                          {i18n.language === 'bn' ? news.category.name_bn : news.category.name_en}
                        </span>
                      )}
                      <h3 className="more-news-title">
                        {i18n.language === 'bn' ? news.title_bn : news.title_en}
                      </h3>
                      {news.author_name && (
                        <div className="news-author-date">
                          <span className="author-name">{news.author_name}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
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

        <aside className="sidebar sidebar-right">
          <SearchBox />
          <BanglaDateTime />
          <SatkhiraInfo />
          <CategorySidebar categories={categories} />
        </aside>
      </div>

      <AdBanner position="footer" />
      
      <Footer />
    </div>
  );
};

export default HomePage;
