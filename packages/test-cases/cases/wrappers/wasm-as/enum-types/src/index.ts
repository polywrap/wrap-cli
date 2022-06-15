import {
  SanityEnum,
  Input_method1,
  Input_method2,
} from "./wrap";

export function method1(input: Input_method1): SanityEnum {
  return input.en;
}

export function method2(input: Input_method2): SanityEnum[] {
  return input.enumArray;
}
