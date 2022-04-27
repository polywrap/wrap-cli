import { Tracer } from "@web3api/tracing-js";

/** URI configuration */
export interface UriConfig {
  authority: string;
  path: string;
  uri: string;
}

/**
 * A Web3API URI. Some examples of valid URIs are:
 * w3://ipfs/QmHASH
 * w3://ens/sub.dimain.eth
 * w3://fs/directory/file.txt
 * w3://uns/domain.crypto
 *
 * Breaking down the various parts of the URI, as it applies
 * to [the URI standard](https://tools.ietf.org/html/rfc3986#section-3):
 * **w3://** - URI Scheme: differentiates Web3API URIs.
 * **ipfs/** - URI Authority: allows the Web3API URI resolution algorithm to determine an authoritative URI resolver.
 * **sub.domain.eth** - URI Path: tells the Authority where the API resides.
 */
export class Uri {
  private _config: UriConfig;

  public get authority(): string {
    return this._config.authority;
  }

  public get path(): string {
    return this._config.path;
  }

  public get uri(): string {
    return this._config.uri;
  }

  constructor(uri: string) {
    this._config = Uri.parseUri(uri);
  }

  public static equals(a: Uri, b: Uri): boolean {
    return a.uri === b.uri;
  }

  public static isUri(value: unknown): value is Uri {
    return typeof value === "object" && (value as Uri).uri !== undefined;
  }

  public static isValidUri(uri: string, parsed?: UriConfig): boolean {
    try {
      const result = Uri.parseUri(uri);

      if (parsed) {
        parsed = Object.assign(parsed, result);
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  public toString(): string {
    return this._config.uri;
  }

  @Tracer.traceMethod("Uri: parseUri")
  public static parseUri(uri: string): UriConfig {
    if (!uri) {
      throw Error("The provided URI is empty");
    }

    let processed = uri;

    // Trim preceding '/' characters
    while (processed[0] === "/") {
      processed = processed.substring(1);
    }

    // Check for the w3:// scheme, add if it isn't there
    const w3SchemeIdx = processed.indexOf("w3://");

    // If it's missing the w3:// scheme, add it
    if (w3SchemeIdx === -1) {
      processed = "w3://" + processed;
    }

    // If the w3:// is not in the beginning, throw an error
    if (w3SchemeIdx > -1 && w3SchemeIdx !== 0) {
      throw Error(
        "The w3:// scheme must be at the beginning of the URI string"
      );
    }

    // Extract the authoriy & path
    let result = processed.match(/w3:\/\/([a-z][a-z0-9-_]+)\/(.*)/);

    // Remove all empty strings
    if (result) {
      result = result.filter((str) => !!str);
    }

    if (!result || result.length !== 3) {
      throw Error(
        `URI is malformed, here are some examples of valid URIs:\n` +
          `w3://ipfs/QmHASH\n` +
          `w3://ens/domain.eth\n` +
          `ens/domain.eth\n\n` +
          `Invalid URI Received: ${uri}`
      );
    }

    return {
      uri: processed,
      authority: result[1],
      path: result[2],
    };
  }
}
