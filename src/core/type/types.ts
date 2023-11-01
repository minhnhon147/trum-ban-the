export type Optional<T> = {
  [K in keyof T]?: T[K];
};

export type ValueOf<T> = T[keyof T];

export interface Brand {
  id: number;
  brand_name: string;
  logo: string;
}

export interface Card {
  id: number;
  brand_id: number;
  price: number;
  discount: number;
}
