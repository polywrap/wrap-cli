import {
  Args_getKey,
  Args_returnMap
} from "./wrap";

export function getKey(args: Args_getKey): i32 {
  let result = args.map.get(args.key);
  return result;
}

export function returnMap(args: Args_returnMap): Map<string, i32> {
  return args.map;
}
