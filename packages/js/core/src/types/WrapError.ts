import { CleanResolutionStep } from "../algorithms";

/**
Wrap error codes provide additional context to WrapErrors.

Error code naming convention (approximate):
    type of handler
    type of functionality
    piece of functionality
    ==> handler_typeFn_pieceFn

Error code map:
  0-24 -> Client
  25-49 -> URI resolution
  50-74 -> Wasm wrapper invocation & sub-invocation
  75-99 -> Plugin invocation & sub-invocation
  100-255 -> Unallocated
 */
export enum WrapErrorCode {
  UNKNOWN,
  CLIENT_LOAD_WRAPPER,
  CLIENT_GET_FILE,
  CLIENT_GET_IMPLEMENTATIONS,
  CLIENT_VALIDATE_RESOLUTION,
  CLIENT_VALIDATE_ABI,
  CLIENT_VALIDATE_RECURSIVE,
  URI_RESOLUTION = 25,
  URI_RESOLVER,
  URI_NOT_FOUND,
  WASM_INVOKE_ABORTED = 50,
  WASM_SUBINVOKE_ABORTED,
  WASM_INVOKE_FAIL,
  WASM_MODULE_NOT_FOUND,
  WASM_STATE_ERROR,
  WASM_SERIALIZATION_ERROR,
  PLUGIN_INVOKE_FAIL = 75,
  PLUGIN_METHOD_NOT_FOUND,
  PLUGIN_ARGS_MALFORMED,
}

export type WrapErrorSource = Readonly<{
  file?: string;
  row?: number;
  col?: number;
}>;

export interface WrapErrorOptions {
  code: WrapErrorCode;
  uri: string;
  method?: string;
  args?: string;
  source?: WrapErrorSource;
  resolutionStack?: CleanResolutionStep;
  cause?: unknown;
  prev?: Error;
  stack?: string;
}

type RegExpGroups<T extends string> =
  | (RegExpExecArray & {
      groups?: { [name in T]: string | undefined } | { [key: string]: string };
    })
  | null;

export class WrapError extends Error {
  readonly name: string;
  readonly code: WrapErrorCode;
  readonly reason: string;
  readonly uri: string;
  readonly method?: string;
  readonly args?: string;
  readonly source?: WrapErrorSource;
  readonly resolutionStack?: CleanResolutionStep;
  readonly cause?: unknown;
  readonly prev?: Error;

  private static re = new RegExp(
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

  constructor(reason = "Encountered an exception.", options: WrapErrorOptions) {
    super(WrapError.stringify(reason, options));
    this.name = WrapError.codeToName(options.code);
    this.code = options.code;
    this.reason = reason;
    this.uri = options.uri;
    this.method = options.method;
    this.args = options.args;
    this.source = options.source;
    this.resolutionStack = options.resolutionStack;
    this.cause = options.cause;
    this.stack = options.stack;
    this.prev = options.prev;
    Object.setPrototypeOf(this, WrapError.prototype);
  }

  static parse(error: string): WrapError | undefined {
    const delim = "\n\nAnother exception was encountered during execution:\n";
    const errorStrings = error.split(delim);

    // case: single WrapError or not a WrapError
    if (errorStrings.length === 1) {
      const args = WrapError._parse(error);
      return args ? new WrapError(args.reason, args.options) : undefined;
    }

    // case: stack of WrapErrors stringified
    const errArgs = errorStrings.map(WrapError._parse);

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

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  // parse a single WrapError, where the 'prev' property is undefined
  private static _parse(
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
    > = WrapError.re.exec(error);
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
    const source: WrapErrorSource | undefined = file
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

  private static stringify(reason: string, options: WrapErrorOptions) {
    const {
      code,
      uri,
      method,
      args,
      source,
      resolutionStack,
      cause,
      prev,
    } = options;
    const formattedCode = `${code} ${WrapErrorCode[code].replace(/_/g, " ")}`;

    // Some items are not always present
    const maybeMethod = method ? `method: ${method}` : "";
    const maybeArgs = args ? `args: ${args} ` : "";
    // source is uses () instead of {} to facilitate regex
    const maybeSource = source
      ? `source: { file: "${source?.file}", row: ${source?.row}, col: ${source?.col} }`
      : "";
    const maybeResolutionStack = resolutionStack
      ? `uriResolutionStack: ${JSON.stringify(resolutionStack, null, 2)}`
      : "";

    const errorCause = WrapError.stringifyCause(cause);
    const maybeCause = errorCause
      ? `\nThis exception was caused by the following exception:\n${errorCause}`
      : "";

    const maybeDelim = prev
      ? `\nAnother exception was encountered during execution:\n${prev}`
      : "";

    return [
      WrapError.metaMessage(code),
      `code: ${formattedCode}`,
      `reason: ${reason}`,
      `uri: ${uri}`,
      maybeMethod,
      maybeArgs,
      maybeSource,
      maybeResolutionStack,
      maybeCause,
      maybeDelim,
    ]
      .filter((it) => !!it)
      .join("\n");
  }

  private static stringifyCause(cause: unknown): string | undefined {
    if (cause === undefined || cause === null) {
      return undefined;
    } else if (cause instanceof Error) {
      return cause.toString();
    } else if (typeof cause === "object" && cause) {
      if (
        cause.toString !== Object.prototype.toString &&
        typeof cause.toString === "function"
      ) {
        return cause.toString();
      }
      return JSON.stringify(cause);
    } else if (
      typeof cause === "function" &&
      cause.toString !== Object.prototype.toString &&
      typeof cause.toString === "function"
    ) {
      return cause.toString();
    } else {
      return `${cause}`;
    }
  }

  private static codeToName(code: WrapErrorCode): string {
    if (code < 25) {
      return "WrapError";
    } else if (code < 50) {
      return "UriResolutionError";
    } else if (code < 75) {
      return "InvokeError";
    } else if (code < 100) {
      return "PluginError";
    } else {
      return "WrapError";
    }
  }

  private static metaMessage(code: WrapErrorCode): string {
    switch (code) {
      case WrapErrorCode.CLIENT_LOAD_WRAPPER:
        return "Failed to create Wrapper from WrapPackage.";
      case WrapErrorCode.CLIENT_GET_FILE:
        return "An error occurred while retrieving a file.";
      case WrapErrorCode.CLIENT_GET_IMPLEMENTATIONS:
        return "An error occurred while retrieving interface implementations.";
      case WrapErrorCode.CLIENT_VALIDATE_RESOLUTION:
        return "An URI resolution error occurred while validating a WRAP URI.";
      case WrapErrorCode.CLIENT_VALIDATE_ABI:
        return "An error occurred while validating a WRAP URI against its ABI.";
      case WrapErrorCode.CLIENT_VALIDATE_RECURSIVE:
        return "An error occurred while recursively validating a WRAP URI.";
      case WrapErrorCode.URI_RESOLUTION:
        return "Unable to resolve URI.";
      case WrapErrorCode.URI_RESOLVER:
        return "An internal resolver error occurred while resolving a URI.";
      case WrapErrorCode.URI_NOT_FOUND:
        return "URI not found.";
      case WrapErrorCode.WASM_INVOKE_ABORTED:
        return "Wasm module aborted execution.";
      case WrapErrorCode.WASM_SUBINVOKE_ABORTED:
        return "Wasm module aborted execution during a subinvocation.";
      case WrapErrorCode.WASM_INVOKE_FAIL:
        return "Invocation exception encountered.";
      case WrapErrorCode.WASM_MODULE_NOT_FOUND:
        return "Wrapper does not contain a Wasm module.";
      case WrapErrorCode.WASM_STATE_ERROR:
        return "Invocation state is missing.";
      case WrapErrorCode.WASM_SERIALIZATION_ERROR:
        return "An exception was encountered while deserializing arguments or serializing results.";
      case WrapErrorCode.PLUGIN_METHOD_NOT_FOUND:
        return "Method not found in plugin module.";
      case WrapErrorCode.PLUGIN_ARGS_MALFORMED:
        return "Malformed arguments passed to plugin.";
      case WrapErrorCode.PLUGIN_INVOKE_FAIL:
        return "Invocation exception encountered.";
      default:
        return "Unknown exception.";
    }
  }
}
