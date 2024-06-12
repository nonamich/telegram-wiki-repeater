export class I18nException extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'I18nError';
  }
}
