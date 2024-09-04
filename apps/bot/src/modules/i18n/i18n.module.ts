import { Global, Module, OnModuleInit } from '@nestjs/common';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

import { I18N_LANGS } from './i18n.constants';
import { i18nextOptions } from './i18n.options';

@Global()
@Module({})
export class I18nModule implements OnModuleInit {
  async onModuleInit() {
    await Promise.all([this.initDayjs(), this.initI18next()]);
  }

  private async initI18next() {
    await i18next.use(Backend).init(i18nextOptions);
  }

  private async initDayjs() {
    await Promise.all(I18N_LANGS.map((lang) => import(`dayjs/locale/${lang}`)));
  }
}
