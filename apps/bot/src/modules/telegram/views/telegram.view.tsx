import { Injectable } from '@nestjs/common';

import { VNode } from 'preact';
import { renderToString } from 'preact-render-to-string';

import { TelegramViewsUtils } from './telegram.view.utils';
import {
  FeaturedImage,
  Props as FeaturedImageProps,
} from './templates/FeaturedImage';

@Injectable()
export class TelegramViews {
  render(node: VNode) {
    const unsanitizeHtml = renderToString(node);
    const html = TelegramViewsUtils.getSanitizedHTML(unsanitizeHtml);

    return html;
  }

  renderFeaturedImage(props: FeaturedImageProps) {
    return this.render(<FeaturedImage {...props} />);
  }
}
