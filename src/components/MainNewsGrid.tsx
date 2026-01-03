import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/MainNewsGrid.css';

interface News {
  id: number;
  title_en: string;
  title_bn: string;
  summary_en?: string;
  summary_bn?: string;
  slug: string;
  image?: string;
  author_name?: string;
  created_at: string;
  category?: {
    id: number;
    name_en: string;
    name_bn: string;
    slug: string;
  };
}

interface MainNewsGridProps {
  news: News[];
}

const MainNewsGrid = ({ news }: MainNewsGridProps) => {
  const { i18n } = useTranslation();

  if (!news || news.length === 0) return null;

  // Placeholder image for news without images
  const placeholderImage = 'https://via.placeholder.com/800x600/cccccc/666666?text=No+Image';

  const leadNews = news[0];
  const secondaryNews = news.slice(1, 3);
  const gridNews = news.slice(3, 9);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="main-news-grid">
      {/* Lead Story */}
      <div className="lead-story">
        <Link to={`/news/${leadNews.slug}`} className="lead-story-link">
          <div className="lead-story-image">
            <img 
              src={leadNews.image || placeholderImage} 
              alt={i18n.language === 'bn' ? leadNews.title_bn : leadNews.title_en}
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
            {leadNews.category && (
              <span className="lead-category-badge">
                {i18n.language === 'bn' ? leadNews.category.name_bn : leadNews.category.name_en}
              </span>
            )}
          </div>
          <div className="lead-story-content">
            <h2 className="lead-story-title">
              {i18n.language === 'bn' ? leadNews.title_bn : leadNews.title_en}
            </h2>
            {(leadNews.summary_en || leadNews.summary_bn) && (
              <p className="lead-story-summary">
                {i18n.language === 'bn' ? leadNews.summary_bn : leadNews.summary_en}
              </p>
            )}
            <div className="lead-story-meta">
              {leadNews.author_name && (
                <span className="news-author">
                  <i className="author-icon">✍</i> {leadNews.author_name}
                </span>
              )}
              <span className="news-date">{formatDate(leadNews.created_at)}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary Stories */}
      <div className="secondary-stories">
        {secondaryNews.map((item) => (
          <Link key={item.id} to={`/news/${item.slug}`} className="secondary-story">
            <div className="secondary-story-image">
              <img 
                src={item.image || placeholderImage} 
                alt={i18n.language === 'bn' ? item.title_bn : item.title_en}
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
            <div className="secondary-story-content">
              {item.category && (
                <span className="story-category">
                  {i18n.language === 'bn' ? item.category.name_bn : item.category.name_en}
                </span>
              )}
              <h3 className="secondary-story-title">
                {i18n.language === 'bn' ? item.title_bn : item.title_en}
              </h3>
              <div className="story-meta">
                {item.author_name && (
                  <span className="story-author">{item.author_name} • </span>
                )}
                <span className="story-date">{formatDate(item.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Grid Stories */}
      <div className="grid-stories">
        {gridNews.map((item) => (
          <Link key={item.id} to={`/news/${item.slug}`} className="grid-story">
            <div className="grid-story-image">
              <img 
                src={item.image || placeholderImage} 
                alt={i18n.language === 'bn' ? item.title_bn : item.title_en}
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
            <div className="grid-story-content">
              {item.category && (
                <span className="story-category">
                  {i18n.language === 'bn' ? item.category.name_bn : item.category.name_en}
                </span>
              )}
              <h4 className="grid-story-title">
                {i18n.language === 'bn' ? item.title_bn : item.title_en}
              </h4>
              <div className="story-meta">
                {item.author_name && (
                  <span className="story-author">{item.author_name} • </span>
                )}
                <span className="story-date">{formatDate(item.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainNewsGrid;
