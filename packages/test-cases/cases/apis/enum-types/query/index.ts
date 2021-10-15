import {
  TypeUnion,
  Input_method1,
  Input_method2,
  Input_method3
} from "./w3";

export function method1(input: Input_method1): boolean {
  return true;
}

export function method2(input: Input_method2): TypeUnion {
  return input.enumArray;
}

export function method3(input: Input_method3): TypeUnion {
  return input.enumArray;
}
