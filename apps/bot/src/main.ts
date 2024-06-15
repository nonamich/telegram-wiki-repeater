import { createNestApp } from './app';

handler();

async function handler() {
  await createNestApp();
}
