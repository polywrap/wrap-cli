import { Args_getData, Args_setData, MemoryStorage_Module, IModule } from "./wrap";

export class Module extends IModule {
  getData(): i32 {
    const result = MemoryStorage_Module.getData({});
    return result.unwrap();
  }

  setData(value: i32): bool {
    const result = MemoryStorage_Module.setData({ value: args.value });
    return result.unwrap();
  }
}
