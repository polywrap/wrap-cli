import {
  Args_add,
  Args_addInBox,
  Args_addFromEnv,
  Num,
  Env
} from "./wrap";

export function add(args: Args_add): i32 {
  return args.x + args.y;
}

export function addInBox(args: Args_addInBox): Num {
  return { value: args.x + args.y };
}

export function addFromEnv(args: Args_addFromEnv, env: Env): i32 {
  return args.x + env.value;
}