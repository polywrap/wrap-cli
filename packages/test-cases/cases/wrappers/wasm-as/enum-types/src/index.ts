import {
  SanityEnum,
  Args_method1,
  Args_method2,
} from "./wrap";

export function method1(args: Args_method1): SanityEnum {
  return args.en;
}

export function method2(args: Args_method2): SanityEnum[] {
  return args.enumArray;
}
