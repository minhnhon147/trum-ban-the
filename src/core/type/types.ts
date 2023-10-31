export type Optional<T> = {
  [K in keyof T]?: T[K];
};

export type ValueOf<T> = T[keyof T];
