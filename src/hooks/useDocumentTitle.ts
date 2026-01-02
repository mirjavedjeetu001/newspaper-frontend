import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useDocumentTitle = (title?: string) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (title) {
      document.title = title;
    } else {
      // Default title
      document.title = i18n.language === 'bn' ? 'প্রতিদিনের সংবাদ' : 'Daily News';
    }
  }, [title, i18n.language]);
};
