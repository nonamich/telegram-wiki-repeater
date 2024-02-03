import resources from './resources';
import {
  I18N_SUPPORTED_LANGS,
  I18N_DEFAULT_LANG,
} from './telegram.i18n.constants';
import { I18NextOptions } from './telegram.i18n.interface';

export const i18nextOptions: I18NextOptions = {
  debug: false,
  lng: I18N_DEFAULT_LANG,
  fallbackLng: I18N_DEFAULT_LANG,
  supportedLngs: Object.keys(I18N_SUPPORTED_LANGS),
  resources,
} satisfies I18NextOptions;
