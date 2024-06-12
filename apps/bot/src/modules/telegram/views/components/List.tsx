import { VNode } from 'preact';

type Props<T> = {
  items: T[];
  each: (item: T, index: number) => VNode;
  separator?: string;
};

export const List = <T,>({ items, each, separator = '' }: Props<T>) => {
  return (
    <>
      {items.map((item, index) => {
        return (
          <>
            {index > 0 && separator}
            {each(item, index)}
          </>
        );
      })}
    </>
  );
};
