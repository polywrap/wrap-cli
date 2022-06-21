@external("wrap", "asyncFunc")
declare function asyncFunc(ms: number): void;

@external("wrap", "log")
declare function log(value: number): void;

export function main(): void {
  log(0)
  asyncFunc(4000);
  log(1)
  asyncFunc(2000);
  log(2)
  asyncFunc(1000);
  asyncFunc(1000);
  log(3)
}
