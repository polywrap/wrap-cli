import { Args_getData, Args_setData, MemoryStorage_Module, IModule } from "./wrap";

export class Module extends IModule {
  getData(args: Args_getData): i32 {
    const result = MemoryStorage_Module.getData({});
    return result.unwrap();
  }

  setData(args: Args_setData): bool {
    const result = MemoryStorage_Module.setData({ value: args.value });
    return result.unwrap();
  }
}
