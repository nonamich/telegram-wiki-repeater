import { createApp } from './app';

handler();

async function handler() {
  const app = await createApp();

  app.init();
}
