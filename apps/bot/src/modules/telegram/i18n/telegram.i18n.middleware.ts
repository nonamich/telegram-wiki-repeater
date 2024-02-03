import i18next from 'i18next';
import { MiddlewareFn } from 'telegraf';

import { MyContext } from '../interfaces';
import { i18nextOptions } from './telegram.i18n';
import {
  I18N_SUPPORTED_LANGS,
  I18N_DEFAULT_LANG,
} from './telegram.i18n.constants';

export const i18nextMiddleware = () => {
  i18next.init(i18nextOptions);

  const middleware: MiddlewareFn<MyContext> = async (ctx, next) => {
    let lng = ctx.session?.locale ?? ctx?.from?.language_code;

    if (!lng || !(lng in I18N_SUPPORTED_LANGS)) {
      lng = I18N_DEFAULT_LANG;
    }

    const i18nextInstance = i18next.cloneInstance({
      initImmediate: false,
    });

    i18nextInstance.on('languageChanged', (lng) => {
      ctx.session.locale = lng;
    });

    i18nextInstance.changeLanguage(lng);

    ctx.i18next = i18nextInstance;

    await next();
  };

  return middleware;
};
