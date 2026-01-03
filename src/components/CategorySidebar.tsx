import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/CategorySidebar.css';

interface Category {
  id: number;
  name_en: string;
  name_bn: string;
  slug: string;
  news_count?: number;
}

interface CategorySidebarProps {
  categories: Category[];
}

const CategorySidebar = ({ categories }: CategorySidebarProps) => {
  const { i18n } = useTranslation();

  return (
    <div className="category-sidebar">
      <h3 className="sidebar-title">
        {i18n.language === 'bn' ? 'বিভাগসমূহ' : 'Categories'}
      </h3>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            <Link to={`/category/${category.slug}`} className="category-link">
              <span className="category-name">
                {i18n.language === 'bn' ? category.name_bn : category.name_en}
              </span>
              <span className="category-arrow">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;
