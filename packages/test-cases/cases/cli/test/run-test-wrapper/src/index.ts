import {
  Args_add,
  Args_addInBox,
  Args_addFromEnv,
  Args_returnMap,
  Num,
  Env,
  IModule,
} from "./wrap";

export class Module extends IModule {
  add(args: Args_add): i32 {
    return args.x + args.y;
  }

  addInBox(args: Args_addInBox): Num {
    return { value: args.x + args.y };
  }

  addFromEnv(args: Args_addFromEnv): i32 {
    return args.x + this.env.value;
  }

  returnMap(args: Args_returnMap): Map<string, Map<string, i32>> {
    return args.map;
  }
}
