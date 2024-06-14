export abstract class TelegramShowTime {
  static get hour() {
    return new Date().getHours();
  }

  static isFeaturedImage() {
    return this.hour >= 12;
  }

  static isFeaturedArticle() {
    return this.hour >= 12;
  }
}
