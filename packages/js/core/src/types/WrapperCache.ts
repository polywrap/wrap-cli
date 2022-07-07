import { Wrapper } from "./Wrapper";

export interface WrapperCache {
  readonly size: number;

  clear(): void;
  delete(key: string): boolean;
  get(key: string): Wrapper | undefined;
  has(key: string): boolean;
  set(key: string, value: Wrapper): void;
}
