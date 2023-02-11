import {
  Args_getKey,
  Args_returnMap,
  Args_returnCustomMap,
  Args_returnNestedMap,
  CustomMap,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  getKey(args: Args_getKey): i32 {
    return args.foo.map.get(args.key);
  }

  returnMap(args: Args_returnMap): Map<string, i32> {
    return args.map;
  }

  returnCustomMap(args: Args_returnCustomMap): CustomMap {
    return args.foo;
  }

  returnNestedMap(args: Args_returnNestedMap): Map<string, Map<string, i32>> {
    return args.foo;
  }
}
