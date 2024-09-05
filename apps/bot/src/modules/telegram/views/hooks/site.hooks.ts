import { WikiSites } from '~/modules/wiki/wiki.sites';

import { useI18n } from '.';

export const useSite = () => {
  const { language } = useI18n();

  return WikiSites.sites[language];
};
