export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly (infer U)[] ? readonly U[] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};
