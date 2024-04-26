import { Injectable } from '@nestjs/common';

import { I18nContext } from './i18n.context';

@Injectable()
export class I18nService {
  async runWithContext(
    lang: string,
    next: (...args: any[]) => Promise<void> | void,
  ) {
    const ctx = new I18nContext(lang);

    await ctx.create(next);
  }

  currentContext() {
    return I18nContext.current();
  }
}
