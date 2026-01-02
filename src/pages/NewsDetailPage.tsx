import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { newsAPI } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/NewsDetail.css';

interface News {
  id: number;
  title_en: string;
  title_bn: string;
  content_en: string;
  content_bn: string;
  image: string;
  video_url: string;
  category: any;
  views: number;
  created_at: string;
}

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  // Set document title based on news title
  useDocumentTitle(
    news 
      ? `${i18n.language === 'bn' ? news.title_bn : news.title_en} | ${i18n.language === 'bn' ? 'প্রতিদিনের সংবাদ' : 'Daily News'}`
      : undefined
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsAPI.getOne(Number(id));
        setNews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!news) {
    return <div>News not found</div>;
  }

  const title = i18n.language === 'bn' ? news.title_bn : news.title_en;
  const content = i18n.language === 'bn' ? news.content_bn : news.content_en;

  return (
    <div className="news-detail-page">
      <Header categories={[]} />
      
      <div className="news-detail-container">
        <div className="news-detail-content">
          <div className="news-category">
            {news.category && (i18n.language === 'bn' ? news.category.name_bn : news.category.name_en)}
          </div>
          
          <h1 className="news-title">{title}</h1>
          
          <div className="news-meta">
            <span className="news-date">{new Date(news.created_at).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US')}</span>
            <span className="news-views">{news.views} {i18n.language === 'bn' ? 'বার দেখা হয়েছে' : 'views'}</span>
          </div>

          {news.image && (
            <div className="news-image-container">
              <img src={news.image} alt={title} className="news-image" />
            </div>
          )}

          {news.video_url && (
            <div className="news-video-container">
              <video controls className="news-video">
                <source src={news.video_url} type="video/mp4" />
              </video>
            </div>
          )}

          <div className="news-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;
