export type WrapErrorSource = Readonly<{
  file?: string;
  line?: number;
  col?: number;
}>;

// 0-49 -> Internal
// 50-99 -> URI Resolution
// 100-150 -> Wasm wrapper invocation
// 150-199 -> Wasm wrapper sub-invocation
// 200-255 -> Plugin invocation & sub-invocation
export enum WrapErrorCode {
  UNKNOWN,
  LOAD_WRAPPER_FAIL,
  QUERY_MALFORMED = 48,
  QUERY_FAIL,
  URI_RESOLUTION_ERROR = 50,
  URI_RESOLVER_ERROR,
  URI_NOT_FOUND,
  WASM_INVOKE_ABORTED = 100,
  WASM_INVOKE_FAIL,
  WASM_NO_MODULE,
  WASM_METHOD_NOT_FOUND,
  PLUGIN_INVOKE_ABORTED = 200,
  PLUGIN_INVOKE_FAIL,
  PLUGIN_METHOD_NOT_FOUND,
  PLUGIN_ARGS_MALFORMED,
}

export interface WrapErrorOptions {
  code: WrapErrorCode;
  uri: string;
  method?: string;
  args?: string;
  source?: WrapErrorSource;
  resolutionStack?: string;
  cause?: unknown;
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
  readonly resolutionStack?: string;
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
      /(?:(?:\r\n|\r|\n)source: \{ file: "(?<file>.+)", row: (?<line>[0-9]+), col: (?<col>[0-9]+) })?/
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
      | "line"
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
      line,
      col,
      resolutionStack,
      cause: causeStr,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = result.groups!;

    const code = parseInt(codeStr as string);

    // replace parens () with brackets {}
    const source: WrapErrorSource | undefined = file
      ? {
          file,
          line: line ? parseInt(line) : undefined,
          col: col ? parseInt(col) : undefined,
        }
      : undefined;

    // message may be a stringified WrapError
    let cause: WrapError | undefined;
    if (this.re.test(message as string)) {
      cause = this.parse(message as string);
    }

    return new WrapError(message, {
      code,
      uri: uri as string,
      method,
      args,
      source,
      resolutionStack,
      cause: cause ?? causeStr,
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
      ? `source: { file: "${source?.file}", row: ${source?.line}, col: ${source?.col} }`
      : "";
    const maybeResolutionStack = resolutionStack
      ? `uriResolutionStack: ${resolutionStack}`
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
    if (code < 50) {
      return "WrapError";
    } else if (code < 100) {
      return "UriResolutionError";
    } else if (code < 150) {
      return "InvokeError";
    } else if (code < 200) {
      return "SubInvokeError";
    } else {
      return "PluginError";
    }
  }

  private static metaMessage(code: WrapErrorCode): string {
    switch (code) {
      case WrapErrorCode.LOAD_WRAPPER_FAIL:
        return "Failed to create Wrapper from WrapPackage.";
      case WrapErrorCode.QUERY_MALFORMED:
        return "Failed to parse GraphQL query.";
      case WrapErrorCode.QUERY_FAIL:
        return "Unknown query exception encountered.";
      case WrapErrorCode.URI_RESOLUTION_ERROR:
        return "Unable to resolve URI.";
      case WrapErrorCode.URI_RESOLVER_ERROR:
        return "An internal resolver error occurred while resolving a URI.";
      case WrapErrorCode.URI_NOT_FOUND:
        return "URI not found.";
      case WrapErrorCode.WASM_INVOKE_ABORTED:
        return "Wasm module aborted execution.";
      case WrapErrorCode.WASM_INVOKE_FAIL:
        return "Invocation exception encountered.";
      case WrapErrorCode.WASM_NO_MODULE:
        return "Wrapper does not contain a wasm module.";
      case WrapErrorCode.WASM_METHOD_NOT_FOUND:
        return "Could not find invoke function.";
      case WrapErrorCode.PLUGIN_METHOD_NOT_FOUND:
        return "Method not found.";
      case WrapErrorCode.PLUGIN_ARGS_MALFORMED:
        return "Malformed args.";
      case WrapErrorCode.PLUGIN_INVOKE_FAIL:
        return "Invocation exception encountered.";
      default:
        return "Unknown exception.";
    }
  }
}
