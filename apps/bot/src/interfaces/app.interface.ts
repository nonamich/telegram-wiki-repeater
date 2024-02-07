import { Update } from '@telegraf/types';

export interface EventHandlerLambda {
  body: Update;
}

export interface EventHandlerEventBridge {
  handler: 'notifier';
}
