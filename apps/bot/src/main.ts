import { createApp } from './app';

handler();

async function handler() {
  const app = await createApp();

  await app.init();
}
