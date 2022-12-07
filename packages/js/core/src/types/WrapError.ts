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
  CLIENT_QUERY_MALFORMED,
  CLIENT_QUERY_FAIL,
  URI_RESOLUTION = 25,
  URI_RESOLVER,
  URI_NOT_FOUND,
  WASM_INVOKE_ABORTED = 50,
  WASM_INVOKE_FAIL,
  WASM_MODULE_NOT_FOUND,
  WASM_METHOD_NOT_FOUND, // not yet used
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
  readonly text: string;
  readonly uri: string;
  readonly method?: string;
  readonly args?: string;
  readonly source?: WrapErrorSource;
  readonly resolutionStack?: CleanResolutionStep;
  readonly cause?: unknown;

  static re = new RegExp(
    [
      // [A-z]+Error can be replaced with specific error names when finalized
      /^(?:[A-z_: ]*; )?[A-z]+Error: [\w ]+\./.source,
      // there is some padding added to the number of words expected in an error code
      /(?:\r\n|\r|\n)code: (?<code>1?[0-9]{1,2}|2[0-4][0-9]|25[0-5]) (?:[A-Z]+ ?){1,5}/
        .source,
      /(?:\r\n|\r|\n)message: (?<message>(?:.|\r\n|\r|\n)*)/.source,
      /(?:\r\n|\r|\n)uri: (?<uri>wrap:\/\/[A-z0-9_-]+\/.+)/.source,
      /(?:(?:\r\n|\r|\n)method: (?<method>([A-z_]{1}[A-z0-9_]*)))?/.source,
      /(?:(?:\r\n|\r|\n)args: (?<args>\{(?:.|\r\n|\r|\n)+} ))?/.source,
      /(?:(?:\r\n|\r|\n)source: \{ file: "(?<file>.+)", row: (?<row>[0-9]+), col: (?<col>[0-9]+) })?/
        .source,
      /(?:(?:\r\n|\r|\n)uriResolutionStack: (?<resolutionStack>\[(?:.|\r\n|\r|\n)+]))?/
        .source,
      /(?:(?:\r\n|\r|\n){2}Another exception was encountered during execution:(?:\r\n|\r|\n)(?<cause>(?:.|\r\n|\r|\n)+))?$/
        .source,
    ].join("")
  );

  constructor(text = "Encountered an exception.", options: WrapErrorOptions) {
    super(WrapError.stringify(text, options));
    this.name = WrapError.codeToName(options.code);
    this.code = options.code;
    this.text = text;
    this.uri = options.uri;
    this.method = options.method;
    this.args = options.args;
    this.source = options.source;
    this.resolutionStack = options.resolutionStack;
    this.cause = options.cause;
    this.stack = options.stack;
    Object.setPrototypeOf(this, WrapError.prototype);
  }

  static parse(error: string): WrapError | undefined {
    const result: RegExpGroups<
      | "code"
      | "message"
      | "uri"
      | "method"
      | "args"
      | "file"
      | "row"
      | "col"
      | "resolutionStack"
      | "cause"
    > = this.re.exec(error);
    if (!result) {
      return undefined;
    }
    const {
      code: codeStr,
      message,
      uri,
      method,
      args,
      file,
      row,
      col,
      resolutionStack: resolutionStackStr,
      cause: causeStr,
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

    // message may be a stringified WrapError due to current string-based error passing between client and wasm
    let cause: WrapError | undefined;
    if (this.re.test(message as string)) {
      cause = this.parse(message as string);
    }

    return new WrapError(message, {
      code,
      uri: uri as string,
      method,
      args: args?.trim(),
      source,
      resolutionStack,
      cause: cause ?? causeStr, // TODO: is it possible that 'cause' information is lost here?
    });
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  private static stringify(text: string, options: WrapErrorOptions) {
    const { code, uri, method, args, source, resolutionStack, cause } = options;
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
      ? `\nAnother exception was encountered during execution:\n${errorCause}`
      : "";

    return [
      WrapError.metaMessage(code),
      `code: ${formattedCode}`,
      `message: ${text}`,
      `uri: ${uri}`,
      maybeMethod,
      maybeArgs,
      maybeSource,
      maybeResolutionStack,
      maybeCause,
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
      case WrapErrorCode.CLIENT_QUERY_MALFORMED:
        return "Failed to parse GraphQL query.";
      case WrapErrorCode.CLIENT_QUERY_FAIL:
        return "Unknown query exception encountered.";
      case WrapErrorCode.URI_RESOLUTION:
        return "Unable to resolve URI.";
      case WrapErrorCode.URI_RESOLVER:
        return "An internal resolver error occurred while resolving a URI.";
      case WrapErrorCode.URI_NOT_FOUND:
        return "URI not found.";
      case WrapErrorCode.WASM_INVOKE_ABORTED:
        return "Wasm module aborted execution.";
      case WrapErrorCode.WASM_INVOKE_FAIL:
        return "Invocation exception encountered.";
      case WrapErrorCode.WASM_MODULE_NOT_FOUND:
        return "Wrapper does not contain a Wasm module.";
      case WrapErrorCode.WASM_METHOD_NOT_FOUND:
        return "Could not find method in Wasm module.";
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
