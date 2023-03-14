import { ErrorSource } from "@polywrap/wrap-js";

type RegExpGroups<T extends string> =
  | (RegExpExecArray & {
      groups?: { [name in T]: string | undefined } | { [key: string]: string };
    })
  | null;

const re = /\((?<file>.*):(?<row>\d+):(?<col>\d+)\)$/;

// retrieve the most recent line of source information for an error
export function getErrorSource(error?: Error): ErrorSource | undefined {
  if (!error || !error.stack) return undefined;

  // find first source line in stack
  const stack = error.stack?.split("\n");
  let i = 0;
  for (i; i < stack.length && !stack[i].startsWith(`    at`); i++) {} // eslint-disable-line no-empty

  const result: RegExpGroups<"file" | "row" | "col"> = re.exec(stack[i]);
  if (!result) return undefined;

  const { file, row, col } = result.groups!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  return file
    ? {
        file,
        row: row ? parseInt(row) : undefined,
        col: col ? parseInt(col) : undefined,
      }
    : undefined;
}
