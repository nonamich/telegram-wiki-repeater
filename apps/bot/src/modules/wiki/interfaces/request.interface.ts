export interface WikiRequest<T extends object> {
  url: string;
  expires?: number;

  filter?: (data: T) => T;
}
