import { FunctionalComponent } from 'preact';

type Props = {
  description?: string;
};

export const Description: FunctionalComponent<Props> = ({ description }) => {
  if (!description) {
    return <></>;
  }

  return <i>{description}</i>;
};
