import {
  Input_getKey,
  Input_returnMap
} from "./wrap";

export function getKey(input: Input_getKey): i32 {
  let result = input.map.get(input.key);
  return result;
}

export function returnMap(input: Input_returnMap): Map<string, i32> {
  return input.map;
}
