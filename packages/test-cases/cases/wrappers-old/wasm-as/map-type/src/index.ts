import {
  Args_getKey,
  Args_returnMap,
  Args_returnCustomMap,
  Args_returnNestedMap,
  CustomMap
} from "./wrap";

export function getKey(args: Args_getKey): i32 {
  return args.foo.map.get(args.key);
}

export function returnMap(args: Args_returnMap): Map<string, i32> {
  return args.map;
}

export function returnCustomMap(args: Args_returnCustomMap): CustomMap {
  return args.foo;
}

export function returnNestedMap(args: Args_returnNestedMap): Map<string, Map<string, i32>> {
  return args.foo;
}
