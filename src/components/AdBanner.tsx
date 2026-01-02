import { useState, useEffect } from 'react';
import { adAPI } from '../services/api';
import '../styles/AdBanner.css';

interface Ad {
  id: number;
  title: string;
  image_url: string;
  link_url?: string;
  position: string;
  order: number;
  is_active: boolean;
}

interface AdBannerProps {
  position: string;
}

const AdBanner = ({ position }: AdBannerProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // Support both 'top' and 'header' positions
        let searchPosition = position;
        if (position === 'header') {
          // Try to get both 'header' and 'top' ads
          const [headerResponse, topResponse] = await Promise.all([
            adAPI.getByPosition('header').catch(() => ({ data: [] })),
            adAPI.getByPosition('top').catch(() => ({ data: [] }))
          ]);
          const combinedAds = [...(headerResponse.data || []), ...(topResponse.data || [])];
          console.log(`Ads for position "header/top":`, combinedAds);
          setAds(combinedAds);
          setLoading(false);
          return;
        }
        
        const response = await adAPI.getByPosition(searchPosition);
        console.log(`Ads for position "${searchPosition}":`, response.data);
        setAds(response.data || []);
      } catch (error) {
        console.error(`Error fetching ads for position "${position}":`, error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position]);

  if (loading) return null;
  if (!ads || ads.length === 0) {
    console.log(`No active ads found for position: ${position}`);
    return null;
  }

  return (
    <div className={`ad-banner ad-${position}`}>
      {ads.map((ad) => (
        <div key={ad.id} className="ad-item">
          {ad.link_url ? (
            <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
              <img src={ad.image_url} alt={ad.title} loading="lazy" />
            </a>
          ) : (
            <img src={ad.image_url} alt={ad.title} loading="lazy" />
          )}
        </div>
      ))}
    </div>
  );
};

export default AdBanner;
