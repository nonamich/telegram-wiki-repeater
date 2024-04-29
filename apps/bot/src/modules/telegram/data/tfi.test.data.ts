import { WikiFeaturedImage } from '~/modules/wiki/interfaces';

export const tfiTestData: WikiFeaturedImage = {
  title: 'Crack climbing in Indian Creek, Utah',
  thumbnail: {
    source:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Crack_climbing_in_Indian_Creek%2C_Utah.jpg/640px-Crack_climbing_in_Indian_Creek%2C_Utah.jpg',
    width: 640,
    height: 963,
  },
  image: {
    source:
      'https://upload.wikimedia.org/wikipedia/commons/1/19/Crack_climbing_in_Indian_Creek%2C_Utah.jpg',
    width: 2000,
    height: 3008,
  },
  file_page:
    'https://commons.wikimedia.org/wiki/File:Crack_climbing_in_Indian_Creek,_Utah.jpg',
  artist: { html: 'Crystal', text: 'Crystal', name: 'Crystal' },
  credit: {
    html: '<a rel="nofollow" class="external free" href="https://www.flickr.com/photos/46053374@N05/4529826910/">https://www.flickr.com/photos/46053374@N05/4529826910/</a>',
    text: 'https://www.flickr.com/photos/46053374@N05/4529826910/',
  },
  license: {
    type: 'CC BY 2.0',
    code: 'cc-by-2.0',
    url: 'https://creativecommons.org/licenses/by/2.0',
  },
  description: {
    html: 'Climbing at <a rel="mw:WikiLink/Interwiki" href="https://en.wikipedia.org/wiki/Indian%20Creek%20(climbing%20area)" title="en:Indian Creek (climbing area)" class="extiw">Indian Creek</a> climbing area in <a rel="mw:WikiLink/Interwiki" href="https://en.wikipedia.org/wiki/Canyonlands" title="en:Canyonlands" class="extiw">Canyonlands</a> near <a rel="mw:WikiLink/Interwiki" href="https://en.wikipedia.org/wiki/Moab,%20Utah" title="en:Moab, Utah" class="extiw">Moab, Utah</a>',
    text: 'Climbing at Indian Creek climbing area in Canyonlands near Moab, Utah',
    lang: 'en',
  },
  wb_entity_id: 'M32307864',
};
