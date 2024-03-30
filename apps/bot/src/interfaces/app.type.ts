export type EventHandlerLambda = {
  body: string;
};

export type EventHandlerEventBridge = {
  handler: 'notifier';
};

export type EventHandler = EventHandlerLambda | EventHandlerEventBridge;
