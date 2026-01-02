import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/FeaturedNews.css';

interface FeaturedNewsProps {
  news: any[];
}

const FeaturedNews = ({ news }: FeaturedNewsProps) => {
  const { t, i18n } = useTranslation();

  if (!news || news.length === 0) return null;

  const mainNews = news[0];
  const sideNews = news.slice(1, 5);

  return (
    <div className="featured-news">
      <h2 className="section-title">{t('featured')}</h2>
      
      <div className="featured-grid">
        {mainNews && (
          <div className="featured-main">
            <Link to={`/news/${mainNews.id}`}>
              {mainNews.image && (
                <div className="featured-image">
                  <img src={mainNews.image} alt={i18n.language === 'bn' ? mainNews.title_bn : mainNews.title_en} />
                </div>
              )}
              <div className="featured-content">
                <span className="category-tag">
                  {mainNews.category && (i18n.language === 'bn' ? mainNews.category.name_bn : mainNews.category.name_en)}
                </span>
                <h3 className="featured-title">
                  {i18n.language === 'bn' ? mainNews.title_bn : mainNews.title_en}
                </h3>
              </div>
            </Link>
          </div>
        )}

        <div className="featured-sidebar">
          {sideNews.map((item: any) => (
            <Link key={item.id} to={`/news/${item.id}`} className="featured-item">
              {item.image && (
                <div className="item-image">
                  <img src={item.image} alt={i18n.language === 'bn' ? item.title_bn : item.title_en} />
                </div>
              )}
              <div className="item-content">
                <span className="item-category">
                  {item.category && (i18n.language === 'bn' ? item.category.name_bn : item.category.name_en)}
                </span>
                <h4 className="item-title">
                  {i18n.language === 'bn' ? item.title_bn : item.title_en}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;
