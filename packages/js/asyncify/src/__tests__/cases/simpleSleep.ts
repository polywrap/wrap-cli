@external("w3", "asyncFunc")
declare function asyncFunc(): void;

@external("w3", "log")
declare function log(value: number): void;

export function main(): void {
  log(0)
  asyncFunc();
  log(1)
}
