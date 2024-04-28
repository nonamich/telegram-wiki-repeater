import { Catch, ExceptionFilter, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: Error) {
    Logger.error(exception, exception.stack);
  }
}
