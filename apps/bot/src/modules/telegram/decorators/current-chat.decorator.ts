import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';

export const CurrentChat = createParamDecorator(
  (_, executionContext: ExecutionContext) => {
    const ctx =
      TelegrafExecutionContext.create(executionContext).getContext<Context>();

    return ctx.chat!;
  },
);
