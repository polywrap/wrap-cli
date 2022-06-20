@external("wrap", "asyncFunc")
declare function asyncFunc(): void;

@external("wrap", "log")
declare function log(value: number): void;

export function main(): void {
  log(0)
  asyncFunc();
  log(1)
}
