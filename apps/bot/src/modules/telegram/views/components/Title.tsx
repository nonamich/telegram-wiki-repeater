import { FunctionalComponent } from 'preact';

type Props = {
  icon?: string;
  title: string;
  url: string;
};

export const Title: FunctionalComponent<Props> = ({ title, url, icon }) => {
  return (
    <>
      {icon}{' '}
      <a href={url}>
        <strong>{title}</strong>
      </a>
    </>
  );
};
