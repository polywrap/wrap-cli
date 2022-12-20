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
  50-74 -> Wrapper invocation & sub-invocation
  75-255 -> Unallocated
 */
export enum WrapErrorCode {
  CLIENT_LOAD_WRAPPER,
  CLIENT_GET_FILE,
  CLIENT_GET_IMPLEMENTATIONS,
  CLIENT_VALIDATE_RESOLUTION,
  CLIENT_VALIDATE_ABI,
  CLIENT_VALIDATE_RECURSIVE,
  URI_RESOLUTION = 25,
  URI_RESOLVER,
  URI_NOT_FOUND,
  WRAPPER_INVOKE_ABORTED = 50,
  WRAPPER_SUBINVOKE_ABORTED,
  WRAPPER_INVOKE_FAIL,
  WRAPPER_READ_FAIL,
  WRAPPER_STATE_ERROR,
  WRAPPER_METHOD_NOT_FOUND,
  WRAPPER_ARGS_MALFORMED,
}

export interface WrapErrorOptions {
  code: WrapErrorCode;
  uri: string;
  method?: string;
  args?: string;
  source?: {
    file?: string;
    row?: number;
    col?: number;
  };
  resolutionStack?: CleanResolutionStep;
  cause?: unknown;
  prev?: Error;
  stack?: string;
}

export class WrapError extends Error {
  readonly name: string;
  readonly code: WrapErrorCode;
  readonly reason: string;
  readonly uri: string;
  readonly method?: string;
  readonly args?: string;
  readonly source?: Readonly<{
    file?: string;
    row?: number;
    col?: number;
  }>;
  readonly resolutionStack?: CleanResolutionStep;
  readonly cause?: unknown;
  readonly prev?: Error;

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

  toString(): string {
    return `${this.name}: ${this.message}`;
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
      return "ClientError";
    } else if (code < 50) {
      return "UriResolutionError";
    } else if (code < 75) {
      return "InvokeError";
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
      case WrapErrorCode.WRAPPER_INVOKE_ABORTED:
        return "Wrapper aborted execution.";
      case WrapErrorCode.WRAPPER_SUBINVOKE_ABORTED:
        return "Wrapper aborted execution during a subinvocation.";
      case WrapErrorCode.WRAPPER_INVOKE_FAIL:
        return "Invocation exception encountered.";
      case WrapErrorCode.WRAPPER_READ_FAIL:
        return "Wrapper does not contain a module, or module could not be read.";
      case WrapErrorCode.WRAPPER_STATE_ERROR:
        return "Invocation state is missing.";
      case WrapErrorCode.WRAPPER_METHOD_NOT_FOUND:
        return "Method not found in wrapper module.";
      case WrapErrorCode.WRAPPER_ARGS_MALFORMED:
        return "Malformed arguments passed to wrapper.";
      default:
        return "Unknown exception.";
    }
  }
}
