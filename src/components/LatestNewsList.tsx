import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/LatestNewsList.css';

interface News {
  id: number;
  title_en: string;
  title_bn: string;
  slug: string;
  image_url?: string;
  created_at: string;
  category?: {
    name_en: string;
    name_bn: string;
  };
}

interface LatestNewsListProps {
  news: News[];
  title?: string;
}

const LatestNewsList = ({ news, title }: LatestNewsListProps) => {
  const { i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="latest-news-list">
      <h2 className="section-heading">
        {title || (i18n.language === 'bn' ? 'সর্বশেষ খবর' : 'Latest News')}
      </h2>
      <div className="news-list">
        {news.map((item) => (
          <Link key={item.id} to={`/news/${item.slug}`} className="news-list-item">
            {item.image_url && (
              <div className="news-list-image">
                <img src={item.image_url} alt={i18n.language === 'bn' ? item.title_bn : item.title_en} />
              </div>
            )}
            <div className="news-list-content">
              <h3 className="news-list-title">
                {i18n.language === 'bn' ? item.title_bn : item.title_en}
              </h3>
              <div className="news-list-meta">
                {item.category && (
                  <span className="news-category">
                    {i18n.language === 'bn' ? item.category.name_bn : item.category.name_en}
                  </span>
                )}
                <span className="news-date">{formatDate(item.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestNewsList;
