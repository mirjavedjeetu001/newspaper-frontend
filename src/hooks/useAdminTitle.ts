import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { settingsAPI } from '../services/api';

export const useAdminTitle = (pageTitle: string) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const updateTitle = async () => {
      try {
        const response = await settingsAPI.get();
        const siteName = i18n.language === 'bn' ? response.data.site_name_bn : response.data.site_name_en;
        document.title = `${pageTitle} - ${siteName || 'Admin'}`;
      } catch (error) {
        document.title = `${pageTitle} - Admin`;
      }
    };
    updateTitle();
  }, [i18n.language, pageTitle]);
};
