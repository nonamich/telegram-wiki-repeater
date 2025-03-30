import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WikiService } from './wiki.service';
import { WikiUtils } from './wiki.utils';
import { WikiValidator } from './wiki.validator';

@Module({
  imports: [HttpModule],
  providers: [WikiService, WikiUtils, WikiValidator],
  exports: [WikiService, WikiUtils],
})
export class WikiModule {}
