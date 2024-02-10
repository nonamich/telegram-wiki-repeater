import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DBModule } from './db/db.module';
import { RedisModule } from './redis/redis.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          username: config.getOrThrow('REDIS_USERNAME'),
          password: config.getOrThrow('REDIS_PASSWORD'),
          host: config.getOrThrow('REDIS_HOST'),
          port: config.getOrThrow('REDIS_PORT'),
        };
      },
    }),
    DBModule.forRoot(),
    TelegramModule,
  ],
})
export class AppModule {}
