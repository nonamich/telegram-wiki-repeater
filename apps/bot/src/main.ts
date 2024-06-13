import { getLaunchedApp } from './app';

handler();

async function handler() {
  await getLaunchedApp();
}
