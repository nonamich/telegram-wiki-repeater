import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    CacheModule.forRootAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          password: config.getOrThrow('REDIS_PASSWORD'),
          socket: {
            host: config.getOrThrow('REDIS_HOST'),
            port: config.getOrThrow('REDIS_PORT'),
          },
        };
      },
    }),
    DatabaseModule,
    TelegramModule,
  ],
})
export class AppModule {}
