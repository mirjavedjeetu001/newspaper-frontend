import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/CategoryCards.css';

interface Category {
  id: number;
  name_en: string;
  name_bn: string;
  slug: string;
}

interface CategoryCardsProps {
  categories: Category[];
  limit?: number;
}

const CategoryCards = ({ categories, limit = 8 }: CategoryCardsProps) => {
  const { i18n } = useTranslation();
  const displayCategories = categories.slice(0, limit);

  const icons = ['📰', '⚽', '💼', '🌍', '🎬', '💻', '🏛️', '📚'];

  return (
    <div className="category-cards-section">
      <h2 className="section-heading">
        {i18n.language === 'bn' ? 'বিভাগসমূহ' : 'Categories'}
      </h2>
      <div className="category-cards-grid">
        {displayCategories.map((category, index) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="category-card"
          >
            <div className="category-icon">{icons[index % icons.length]}</div>
            <div className="category-name">
              {i18n.language === 'bn' ? category.name_bn : category.name_en}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
