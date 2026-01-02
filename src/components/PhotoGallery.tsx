import { useTranslation } from 'react-i18next';
import '../styles/PhotoGallery.css';

interface PhotoGalleryProps {
  photos: any[];
}

const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const { i18n } = useTranslation();

  if (!photos || photos.length === 0) return null;

  return (
    <div className="photo-gallery">
      <div className="gallery-grid">
        {photos.map((photo: any) => (
          <div key={photo.id} className="gallery-item">
            <img src={photo.image_url} alt={i18n.language === 'bn' ? photo.title_bn : photo.title_en} />
            <div className="gallery-overlay">
              <h4>{i18n.language === 'bn' ? photo.title_bn : photo.title_en}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
