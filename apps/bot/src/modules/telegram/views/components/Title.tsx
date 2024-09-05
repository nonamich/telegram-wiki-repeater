import { FunctionalComponent, JSX } from 'preact';

export type TitleProps = {
  beforeTitle?: JSX.Element | string;
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
