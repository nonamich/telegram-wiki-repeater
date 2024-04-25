export interface EventHandlerLambda {
  body: string;
}

export interface EventHandlerEventBridge {
  handler: 'notifier';
}

export interface EventHandler
  extends EventHandlerLambda,
    EventHandlerEventBridge {}
