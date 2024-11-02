import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { I18nModule } from './i18n/i18n.module';
import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [
    I18nModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RedisModule.forRootAsync({
      global: true,
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          path: config.getOrThrow('REDIS_URL'),
        };
      },
    }),
  ],
})
export class GlobalModule {}
