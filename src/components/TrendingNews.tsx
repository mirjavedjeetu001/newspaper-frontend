import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/TrendingNews.css';

interface TrendingNewsProps {
  news: any[];
}

const TrendingNews = ({ news }: TrendingNewsProps) => {
  const { t, i18n } = useTranslation();

  if (!news || news.length === 0) return null;

  return (
    <div className="trending-news">
      <h3 className="widget-title">{t('trending')}</h3>
      <div className="trending-list">
        {news.map((item: any, index: number) => (
          <Link key={item.id} to={`/news/${item.id}`} className="trending-item">
            <span className="trending-number">{index + 1}</span>
            <div className="trending-content">
              <h4 className="trending-title">
                {i18n.language === 'bn' ? item.title_bn : item.title_en}
              </h4>
              <span className="trending-views">{item.views} {t('views')}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingNews;
