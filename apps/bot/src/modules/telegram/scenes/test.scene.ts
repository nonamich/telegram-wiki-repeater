import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';

import { Context } from '../interfaces/telegram.interface';
import { SCENE_IDS } from '../telegram.enums';

@Scene(SCENE_IDS.TEST)
export class TestScene {
  constructor() {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await ctx.sendMessage('Hello in This scene!');
  }
}
