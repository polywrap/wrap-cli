import {
  Args_getKey,
  Args_returnMap,
  Args_returnCustomMap,
  CustomMap
} from "./wrap";

export function getKey(args: Args_getKey): i32 {
  let result = args.foo.map.get(args.key);
  return result;
}

export function returnMap(args: Args_returnMap): Map<string, i32> {
  return args.map;
}

export function returnCustomMap(args: Args_returnCustomMap): CustomMap {
  return args.foo;
}
