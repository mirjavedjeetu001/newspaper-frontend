import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { newsAPI, categoryAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsCard from '../components/NewsCard';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const [category, setCategory] = useState<any>(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await categoryAPI.getBySlug(slug!);
        setCategory(categoryRes.data);
        
        const newsRes = await newsAPI.getByCategory(categoryRes.data.id);
        setNews(newsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="category-page">
      <Header categories={[]} />
      
      <div className="category-container">
        <h1 className="category-title">
          {category && (i18n.language === 'bn' ? category.name_bn : category.name_en)}
        </h1>
        
        <div className="news-grid">
          {news.map((item: any) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>

        {news.length === 0 && (
          <div className="no-news">
            {i18n.language === 'bn' ? 'কোন খবর পাওয়া যায়নি' : 'No news found'}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
