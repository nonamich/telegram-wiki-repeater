import type { i18n } from 'i18next';
import type { Scenes } from 'telegraf';

import { SceneSession, SceneSessionData } from 'telegraf/typings/scenes';

interface MySessionData {
  locale: string;
}

interface BaseContext {
  i18next: i18n;
  match?: RegExpMatchArray;
}

export interface SceneContext<T extends object = object>
  extends Scenes.SceneContext,
    BaseContext {
  session: SceneSession<SceneSessionData> & MySessionData;

  state: T;
}
