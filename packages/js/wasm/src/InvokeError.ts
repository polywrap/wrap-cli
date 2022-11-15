export type WasmErrorSource = Readonly<{
  file: string;
  line: number;
  col: number;
}>;

export enum InvokeErrorCode {
  ABORTED,
  RETURNED,
}

export interface InvokeErrorOptions {
  code: InvokeErrorCode;
  source?: WasmErrorSource;
  uri: string;
  method: string;
  args?: string;
  cause?: Error;
}

export class InvokeError extends Error {
  readonly name: "InvokeError";
  readonly code: InvokeErrorCode;
  readonly text: string;
  readonly source?: WasmErrorSource;
  readonly uri: string;
  readonly method: string;
  readonly args?: string;
  readonly cause?: Error;

  private static re = new RegExp(
    [
      /^InvokeError: ([\w ]+\.)/.source,
      /(?:\r\n|\r|\n)/.source,
      /message: ((?:.|\r\n|\r|\n)*)/.source,
      /(?:\r\n|\r|\n)/.source,
      /source: (.*)/.source,
      /(?:\r\n|\r|\n)/.source,
      /uri: (.*)/.source,
      /(?:\r\n|\r|\n)/.source,
      /method: (.*)/.source,
      /(?:\r\n|\r|\n)/.source,
      /args: ((?:.|\r\n|\r|\n)*)$/.source,
    ].join("")
  );

  constructor(message: string, options: InvokeErrorOptions) {
    super(InvokeError.stringify(message, options));
    this.text = message;
    this.code = options.code;
    this.source = options.source;
    this.uri = options.uri;
    this.method = options.method;
    this.args = options.args;
    this.cause = options.cause;
    Object.setPrototypeOf(this, InvokeError.prototype);
  }

  static parse(error: string): InvokeError {
    const result = this.re.exec(error);
    if (!result) {
      throw Error("Failed to parse error into InvokeError: " + error);
    }
    const [, metaMessage, text, sourceStr, uri, method, args] = result;

    const code: InvokeErrorCode = error.startsWith(metaMessage)
      ? InvokeErrorCode.ABORTED
      : InvokeErrorCode.RETURNED;
    const source = JSON.parse(sourceStr) as WasmErrorSource;

    // message may be a stringified InvokeError
    let cause: Error | undefined;
    if (this.re.test(text)) {
      cause = this.parse(text);
    }

    return new InvokeError(text, { code, source, uri, method, args, cause });
  }

  toString(): string {
    return InvokeError.stringify(this.text, {
      code: this.code,
      source: this.source,
      uri: this.uri,
      method: this.method,
      args: this.args,
      cause: this.cause,
    });
  }

  private static metaMessage(code: InvokeErrorCode): string {
    switch (code) {
      case InvokeErrorCode.ABORTED:
        return "Wasm module aborted execution.";
      case InvokeErrorCode.RETURNED:
        return "Invocation exception encountered.";
      default:
        return "Unknown invocation exception.";
    }
  }

  private static stringify(text: string, options: InvokeErrorOptions) {
    const { code, source, uri, method, args } = options;
    const sourceStr = source
      ? `{ file: ${source?.file}, row: ${source?.line}, col: ${source?.col} }`
      : "undefined";
    return `${this.name}: ${InvokeError.metaMessage(code)}
message: ${text}
source: ${sourceStr}
uri: ${uri}
method: ${method}
args: ${args ?? "undefined"}`;
  }
}
