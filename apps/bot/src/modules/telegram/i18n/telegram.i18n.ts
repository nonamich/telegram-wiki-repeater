import {
  I18N_SUPPORTED_LANGS,
  I18N_DEFAULT_LANG,
} from './telegram.i18n.constants';
import { I18NextOptions } from './telegram.i18n.interface';
import * as langs from './telegram.i18n.langs';

export const i18nextOptions = {
  debug: false,
  lng: I18N_DEFAULT_LANG,
  fallbackLng: I18N_DEFAULT_LANG,
  supportedLngs: I18N_SUPPORTED_LANGS,
  defaultNS: 'translation',
  resources: langs,
} satisfies I18NextOptions;
