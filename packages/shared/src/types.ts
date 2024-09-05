export type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;

export type NumberToString<T> = T extends number ? string : T;

export type NumberPropertiesToString<T> = {
  [K in keyof T]: NumberToString<T[K]>;
};
