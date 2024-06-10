import { FunctionalComponent } from 'preact';

export type DescriptionProps = {
  description?: string;
};

export const Description: FunctionalComponent<DescriptionProps> = ({
  description,
}) => {
  if (!description) {
    return <></>;
  }

  return <i> - {description}</i>;
};
