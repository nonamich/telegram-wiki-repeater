import {
  WikiArticle,
  WikiFeaturedImage,
  WikiNews,
  WikiOnThisDay,
} from '~/modules/wiki/interfaces';

export class TelegramUniqueIDGenerator {
  getUniqueIdNews(news: WikiNews) {
    return this.getUniqueIdByArticles(news.links);
  }

  getUniqueIdOnThisDay(event: WikiOnThisDay) {
    return this.getUniqueIdByArticles(event.pages);
  }

  getUniqueIdByArticles(articles: WikiArticle[]) {
    return articles.map(this.getUniqueIdArticle).join('');
  }

  getUniqueIdArticle({ pageid }: WikiArticle) {
    return pageid;
  }

  getUniqueIdFeaturedImage({ wb_entity_id }: WikiFeaturedImage) {
    return wb_entity_id;
  }
}
