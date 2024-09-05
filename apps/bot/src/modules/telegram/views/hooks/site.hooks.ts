import { WikiSites } from '~/modules/wiki/wiki.helper';

import { useI18n } from '.';

export const useSite = () => {
  const { language } = useI18n();

  return WikiSites.sites[language];
};
