import { FunctionalComponent } from 'preact';

export type DescriptionProps = {
  description?: string;
  hyphen?: string;
  end?: string;
};

export const Description: FunctionalComponent<DescriptionProps> = ({
  description,
  hyphen = '—',
  end = '',
}) => {
  if (!description) {
    return <></>;
  }

  return (
    <i>
      {' '}
      {hyphen} {description}
      {end}
    </i>
  );
};
