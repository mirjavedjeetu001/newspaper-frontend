import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NewsCardProps {
  news: any;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const { i18n } = useTranslation();

  return (
    <Link to={`/news/${news.id}`} className="news-card">
      {news.image && (
        <div className="news-card-image">
          <img src={news.image} alt={i18n.language === 'bn' ? news.title_bn : news.title_en} />
        </div>
      )}
      <div className="news-card-content">
        {news.category && (
          <span className="news-card-category">
            {i18n.language === 'bn' ? news.category.name_bn : news.category.name_en}
          </span>
        )}
        <h3 className="news-card-title">
          {i18n.language === 'bn' ? news.title_bn : news.title_en}
        </h3>
        <div className="news-card-meta">
          <span>{new Date(news.created_at).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US')}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
