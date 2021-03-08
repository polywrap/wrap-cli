import {
  Enum,
  Input_method1,
  Input_method2,
} from "./w3";

export function method1(input: Input_method1): Enum {
  return input.en;
}

export function method2(input: Input_method2): Enum[] {
  return input.enumArray;
}
