import {
  Args_method1,
  Args_method2,
  Args_method3,
  Args_method5,
  Output,
  Arg2
} from "./wrap";

export function method1(args: Args_method1): Output[] {
  return [
    {
      prop: args.arg1.prop,
      nested: {
        prop: args.arg1.nested.prop
      }
    },
    {
      prop: args.arg2 ? (args.arg2 as Arg2).prop : "",
      nested: {
        prop: args.arg2 ? (args.arg2 as Arg2).circular.prop : ""
      }
    }
  ];
}

export function method2(args: Args_method2): Output | null {
  if (args.arg.prop == "null") {
    return null;
  }

  return {
    prop: args.arg.prop,
    nested: {
      prop: args.arg.nested.prop
    }
  };
}

export function method3(args: Args_method3): (Output | null)[] {
  return [
    null,
    {
      prop: args.arg.prop,
      nested: {
        prop: args.arg.nested.prop
      }
    }
  ]
}

export function method5(args: Args_method5): Output {
  return {
    prop: String.UTF8.decode(args.arg.prop),
    nested: {
      prop: "nested prop"
    }
  };
}
