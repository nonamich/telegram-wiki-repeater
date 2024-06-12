import { FunctionalComponent } from 'preact';

export type DescriptionProps = {
  description?: string;
  hyphen?: string;
};

export const Description: FunctionalComponent<DescriptionProps> = ({
  description,
  hyphen = '—',
}) => {
  if (!description) {
    return <></>;
  }

  return (
    <i>
      {' '}
      {hyphen} {description}
    </i>
  );
};
