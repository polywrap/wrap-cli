import { Args_getData, Args_setData, MemoryStorage_Module } from "./wrap";

export function getData(_args: Args_getData): i32 {
  const result = MemoryStorage_Module.getData({});

  return result.unwrap();
}

export function setData(args: Args_setData): bool {
  const result = MemoryStorage_Module.setData({ value: args.value });

  return result.unwrap();
}
