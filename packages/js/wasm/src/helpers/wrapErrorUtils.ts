import { WrapError, WrapErrorOptions } from "@polywrap/core-js";

export type ErrorSource = Readonly<{
  file?: string;
  row?: number;
  col?: number;
}>;

type RegExpGroups<T extends string> =
  | (RegExpExecArray & {
      groups?: { [name in T]: string | undefined } | { [key: string]: string };
    })
  | null;

const wrapErrorRegEx = new RegExp(
  [
    // [A-z]+Error can be replaced with specific error names when finalized
    /^(?:[A-z_: ]*; )?[A-z]+Error: [\w ]+\./.source,
    // there is some padding added to the number of words expected in an error code
    /(?:\r\n|\r|\n)code: (?<code>1?[0-9]{1,2}|2[0-4][0-9]|25[0-5]) (?:[A-Z]+ ?){1,5}/
      .source,
    /(?:\r\n|\r|\n)reason: (?<reason>(?:.|\r\n|\r|\n)*)/.source,
    /(?:\r\n|\r|\n)uri: (?<uri>wrap:\/\/[A-z0-9_-]+\/.+)/.source,
    /(?:(?:\r\n|\r|\n)method: (?<method>([A-z_]{1}[A-z0-9_]*)))?/.source,
    /(?:(?:\r\n|\r|\n)args: (?<args>\{(?:.|\r\n|\r|\n)+} ))?/.source,
    /(?:(?:\r\n|\r|\n)source: \{ file: "(?<file>.+)", row: (?<row>[0-9]+), col: (?<col>[0-9]+) })?/
      .source,
    /(?:(?:\r\n|\r|\n)uriResolutionStack: (?<resolutionStack>\[(?:.|\r\n|\r|\n)+]))?/
      .source,
    /(?:(?:\r\n|\r|\n){2}This exception was caused by the following exception:(?:\r\n|\r|\n)(?<cause>(?:.|\r\n|\r|\n)+))?$/
      .source,
  ].join("")
);

// parse a stringified WrapError
export function parseWrapError(error: string): WrapError | undefined {
  const delim = "\n\nAnother exception was encountered during execution:\n";
  const errorStrings = error.split(delim);

  // case: single WrapError or not a WrapError
  if (errorStrings.length === 1) {
    const args = parseSimpleWrapError(error);
    return args ? new WrapError(args.reason, args.options) : undefined;
  }

  // case: stack of WrapErrors stringified
  const errArgs = errorStrings.map(parseSimpleWrapError);

  // iterate through args to assign `cause` and `prev`
  let curr: WrapError | undefined = undefined;
  for (let i = errArgs.length - 1; i >= 0; i--) {
    const currArgs = errArgs[i];
    if (!currArgs) {
      // should only happen if a user includes the delimiter in their error message
      throw new Error("Failed to parse WrapError");
    }
    curr = new WrapError(currArgs.reason, {
      ...currArgs.options,
      prev: curr,
    });
  }
  return curr;
}

// parse a single WrapError, where the 'prev' property is undefined
// eslint-disable-next-line @typescript-eslint/naming-convention
function parseSimpleWrapError(
  error: string
): { reason: string; options: WrapErrorOptions } | undefined {
  const result: RegExpGroups<
    | "code"
    | "reason"
    | "uri"
    | "method"
    | "args"
    | "file"
    | "row"
    | "col"
    | "resolutionStack"
    | "cause"
  > = wrapErrorRegEx.exec(error);
  if (!result) {
    return undefined;
  }
  const {
    code: codeStr,
    reason,
    uri,
    method,
    args,
    file,
    row,
    col,
    resolutionStack: resolutionStackStr,
    cause,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = result.groups!;

  const code = parseInt(codeStr as string);

  // replace parens () with brackets {}
  const source: ErrorSource | undefined = file
    ? {
        file,
        row: row ? parseInt(row) : undefined,
        col: col ? parseInt(col) : undefined,
      }
    : undefined;

  const resolutionStack = resolutionStackStr
    ? JSON.parse(resolutionStackStr)
    : undefined;

  return {
    reason: reason as string,
    options: {
      code,
      uri: uri as string,
      method,
      args: args?.trim(),
      source,
      resolutionStack,
      cause,
    },
  };
}
