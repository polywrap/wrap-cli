import {
  Input_method1,
  Input_method2,
  Input_method3,
  Input_method4,
  Input_method5,
  Result,
  Arg2
} from "./w3";

export function method1(input: Input_method1): Result[] {
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

export function method2(input: Input_method2): Result | null {
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

export function method3(input: Input_method3): (Result | null)[] {
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

export function method4(input: Input_method4): Result {
  return {
    prop: "prop",
    nested: {
      prop: "nested prop"
    }
  };
}

export function method5(input: Input_method5): Result {
  return {
    prop: String.UTF8.decode(input.arg.prop),
    nested: {
      prop: "nested prop"
    }
  };
}
