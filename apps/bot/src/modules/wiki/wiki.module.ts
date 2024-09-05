import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WIKI_BASE_URL } from './wiki.constants';
import { WikiService } from './wiki.service';
import { WikiValidator } from './wiki.validator';

@Module({
  imports: [
    HttpModule.register({
      baseURL: WIKI_BASE_URL,
    }),
  ],
  providers: [WikiService, WikiValidator],
  exports: [WikiService],
})
export class WikiModule {}
