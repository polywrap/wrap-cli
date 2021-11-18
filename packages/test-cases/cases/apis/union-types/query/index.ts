import {
  Input_method1
} from "./w3";

export function method1(input: Input_method1): string {
  if(input.arg.isArgUnionA) {
    return input.arg.ArgUnionA.prop;
  }

  return input.arg.ArgUnionB.prop.toString();
}
