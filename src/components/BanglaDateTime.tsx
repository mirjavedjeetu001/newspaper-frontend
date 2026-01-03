import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/BanglaDateTime.css';

const BanglaDateTime = () => {
  const { i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Bangla numerals
  const toBanglaNumber = (num: number): string => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaDigits[parseInt(digit)]).join('');
  };

  // Bangla month names
  const banglaMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const banglaDays = [
    'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
  ];

  const formatBanglaDate = () => {
    const day = currentTime.getDate();
    const month = banglaMonths[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    const dayName = banglaDays[currentTime.getDay()];

    return `${dayName}, ${toBanglaNumber(day)} ${month} ${toBanglaNumber(year)}`;
  };

  const formatBanglaTime = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    return `${toBanglaNumber(hours)}:${toBanglaNumber(minutes)}:${toBanglaNumber(seconds)}`;
  };

  const formatEnglishDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEnglishTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bangla-datetime-card">
      <div className="datetime-content">
        <div className="date-section">
          <div className="icon">📅</div>
          <div className="date-text">
            {i18n.language === 'bn' ? formatBanglaDate() : formatEnglishDate()}
          </div>
        </div>
        <div className="time-section">
          <div className="icon">🕐</div>
          <div className="time-text">
            {i18n.language === 'bn' ? formatBanglaTime() : formatEnglishTime()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanglaDateTime;
