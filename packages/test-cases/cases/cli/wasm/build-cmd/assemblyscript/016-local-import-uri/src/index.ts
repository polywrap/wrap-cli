import {
  Connection,
  Args_log
} from "./wrap";

export function log(args: Args_log): boolean {
  // Just to make sure we can use this type
  const con: Connection = {
    networkNameOrChainId: args.message,
    node: null
  };
  return con.networkNameOrChainId === args.message;
}
