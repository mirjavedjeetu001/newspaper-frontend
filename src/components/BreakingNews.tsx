import { useTranslation } from 'react-i18next';
import '../styles/BreakingNews.css';

interface BreakingNewsProps {
  news: any[];
}

const BreakingNews = ({ news }: BreakingNewsProps) => {
  const { t, i18n } = useTranslation();

  if (!news || news.length === 0) return null;

  return (
    <div className="breaking-news">
      <div className="container">
        <div className="breaking-news-container">
          <span className="breaking-label">{t('breaking')}</span>
          <div className="breaking-content">
            <div className="breaking-slider">
              {news.map((item, index) => (
                <a key={item.id} href={`/news/${item.id}`} className="breaking-item">
                  {i18n.language === 'bn' ? item.title_bn : item.title_en}
                  {index < news.length - 1 && <span className="separator">•</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
