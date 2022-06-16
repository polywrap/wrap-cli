import {
  Input_method1,
  Input_method2,
  Input_method3,
  Input_method5,
  Output,
  Arg2
} from "./wrap";

export function method1(input: Input_method1): Output[] {
  return [
    {
      prop: input.arg1.prop,
      nested: {
        prop: input.arg1.nested.prop
      }
    },
    {
      prop: input.arg2 ? (input.arg2 as Arg2).prop : "",
      nested: {
        prop: input.arg2 ? (input.arg2 as Arg2).circular.prop : ""
      }
    }
  ];
}

export function method2(input: Input_method2): Output | null {
  if (input.arg.prop == "null") {
    return null;
  }

  return {
    prop: input.arg.prop,
    nested: {
      prop: input.arg.nested.prop
    }
  };
}

export function method3(input: Input_method3): (Output | null)[] {
  return [
    null,
    {
      prop: input.arg.prop,
      nested: {
        prop: input.arg.nested.prop
      }
    }
  ]
}

export function method5(input: Input_method5): Output {
  return {
    prop: String.UTF8.decode(input.arg.prop),
    nested: {
      prop: "nested prop"
    }
  };
}
