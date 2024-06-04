import {
  WikiArticle,
  WikiFeaturedImage,
  WikiNews,
  WikiOnThisDay,
} from '~/modules/wiki/interfaces';

export class TelegramUniqueIDGenerator {
  static getUniqueIdNews(news: WikiNews) {
    return this.getUniqueIdByArticles(news.links);
  }

  static getUniqueIdOnThisDay(event: WikiOnThisDay) {
    return this.getUniqueIdByArticles(event.pages);
  }

  static getUniqueIdByArticles(articles: WikiArticle[]) {
    return articles.map(this.getUniqueIdArticle).join('');
  }

  static getUniqueIdArticle({ pageid }: WikiArticle) {
    return pageid;
  }

  static getUniqueIdFeaturedImage({ wb_entity_id }: WikiFeaturedImage) {
    return wb_entity_id;
  }
}
