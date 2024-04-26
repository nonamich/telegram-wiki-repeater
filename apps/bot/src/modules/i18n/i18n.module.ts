import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

import { I18N_LANGS } from './i18n.constants';
import { i18nextOptions } from './i18n.options';
import { I18nService } from './i18n.service';

@Module({})
export class I18nModule implements OnModuleInit {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: I18nModule,
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: I18nModule,
      exports: [I18nService],
      providers: [I18nService],
    };
  }

  async onModuleInit() {
    await Promise.all([this.initDayjs(), this.initI18next()]);
  }

  private async initI18next() {
    i18next.use(Backend);

    await i18next.init(i18nextOptions);
  }

  private async initDayjs() {
    await Promise.all(I18N_LANGS.map((lang) => import(`dayjs/locale/${lang}`)));
  }
}
