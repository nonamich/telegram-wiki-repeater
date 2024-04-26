import { SessionStore, session } from 'telegraf';

export const sessionMiddleware = (store: SessionStore<object>) =>
  session({ store, defaultSession: () => ({ locale: 'en' }) });
