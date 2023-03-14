import {
  Args_add,
  Args_addInBox,
  Args_addFromEnv,
  Args_returnMap,
  Num,
  Env,
  ModuleBase,
} from "./wrap";

export class Module extends ModuleBase {
  add(args: Args_add): i32 {
    return args.x + args.y;
  }

  addInBox(args: Args_addInBox): Num {
    return { value: args.x + args.y };
  }

  addFromEnv(args: Args_addFromEnv, env: Env): i32 {
    return args.x + env.value;
  }

  returnMap(args: Args_returnMap): Map<string, Map<string, i32>> {
    return args.map;
  }
}
