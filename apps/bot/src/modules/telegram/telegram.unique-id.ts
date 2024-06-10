import {
  WikiArticle,
  WikiFeaturedImage,
  WikiNews,
  WikiOnThisDay,
} from '~/modules/wiki/interfaces';

export class TelegramUniqueID {
  static getUniqueIdNews(news: WikiNews) {
    return this.getUniqueIdByArticles(news.links);
  }

  static getUniqueIdOnThisDay(event: WikiOnThisDay) {
    return this.getUniqueIdByArticles(event.pages);
  }

  static getUniqueIdFeaturedImage({ wb_entity_id }: WikiFeaturedImage) {
    return wb_entity_id.toString();
  }

  static getUniqueIdByArticles(articles: WikiArticle[]) {
    return articles.map(this.getUniqueIdArticle).join('');
  }

  static getUniqueIdFeaturedArticle(article: WikiArticle) {
    return this.getUniqueIdArticle(article);
  }

  static getUniqueIdArticle({ pageid }: WikiArticle) {
    return pageid.toString();
  }
}
