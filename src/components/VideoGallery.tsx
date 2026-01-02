import { useTranslation } from 'react-i18next';
import '../styles/VideoGallery.css';

interface VideoGalleryProps {
  videos: any[];
}

const VideoGallery = ({ videos }: VideoGalleryProps) => {
  const { i18n } = useTranslation();

  if (!videos || videos.length === 0) return null;

  return (
    <div className="video-gallery">
      <div className="video-grid">
        {videos.map((video: any) => (
          <div key={video.id} className="video-item">
            <div className="video-thumbnail">
              {video.thumbnail ? (
                <img src={video.thumbnail} alt={i18n.language === 'bn' ? video.title_bn : video.title_en} />
              ) : (
                <video controls>
                  <source src={video.video_url} type="video/mp4" />
                </video>
              )}
              <div className="play-icon">▶</div>
            </div>
            <h4 className="video-title">
              {i18n.language === 'bn' ? video.title_bn : video.title_en}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
