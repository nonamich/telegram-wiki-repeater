import { I18nException } from '~/modules/i18n/exceptions/i18n.exception';
import { I18nContext } from '~/modules/i18n/i18n.context';

export const useI18n = () => {
  const i18n = I18nContext.current();

  if (!i18n) {
    throw new I18nException("doesn't work outside i18n context!");
  }

  return i18n;
};
