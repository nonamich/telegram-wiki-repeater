import { FunctionalComponent } from 'preact';

export type TitleProps = {
  icon?: string;
  title: string;
  url: string;
};

export const Title: FunctionalComponent<TitleProps> = ({
  title,
  url,
  icon,
}) => {
  return (
    <>
      {icon}{' '}
      <a href={url}>
        <strong>{title}</strong>
      </a>
    </>
  );
};
