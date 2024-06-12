import { FunctionalComponent } from 'preact';
import { JSXInternal } from 'preact/src/jsx';

export type TitleProps = {
  beforeTitle?: JSXInternal.Element | string;
  title: string;
  url: string;
};

export const Title: FunctionalComponent<TitleProps> = ({
  title,
  url,
  beforeTitle,
}) => {
  return (
    <>
      {beforeTitle && <>{beforeTitle} </>}
      <a href={url}>
        <strong>{title}</strong>
      </a>
    </>
  );
};
