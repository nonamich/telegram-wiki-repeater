import { Scenes } from 'telegraf';

interface BaseContext {
  match: RegExpMatchArray;
}

export interface Context extends Scenes.SceneContext, BaseContext {}
