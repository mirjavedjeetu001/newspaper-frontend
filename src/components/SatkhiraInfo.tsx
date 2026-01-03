import { useTranslation } from 'react-i18next';
import '../styles/SatkhiraInfo.css';

const SatkhiraInfo = () => {
  const { i18n } = useTranslation();

  return (
    <div className="satkhira-info-card">
      <h3 className="info-title">
        {i18n.language === 'bn' ? 'সাতক্ষীরা' : 'Satkhira'}
      </h3>
      <div className="map-container">
        <svg viewBox="0 0 200 250" className="satkhira-map">
          <path
            d="M 100 20 L 160 60 L 180 120 L 160 180 L 120 230 L 60 230 L 20 180 L 20 120 L 40 60 Z"
            fill="var(--theme-color, #c8102e)"
            opacity="0.2"
            stroke="var(--theme-color, #c8102e)"
            strokeWidth="2"
          />
          <circle cx="100" cy="125" r="8" fill="var(--theme-color, #c8102e)" />
          <text x="100" y="135" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
            {i18n.language === 'bn' ? 'সাতক্ষীরা' : 'Satkhira'}
          </text>
        </svg>
      </div>
      <div className="info-details">
        <div className="info-item">
          <span className="info-label">
            {i18n.language === 'bn' ? 'জেলা:' : 'District:'}
          </span>
          <span className="info-value">
            {i18n.language === 'bn' ? 'সাতক্ষীরা' : 'Satkhira'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">
            {i18n.language === 'bn' ? 'বিভাগ:' : 'Division:'}
          </span>
          <span className="info-value">
            {i18n.language === 'bn' ? 'খুলনা' : 'Khulna'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">
            {i18n.language === 'bn' ? 'উপজেলা:' : 'Upazilas:'}
          </span>
          <span className="info-value">
            {i18n.language === 'bn' ? '৭ টি' : '7'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SatkhiraInfo;
