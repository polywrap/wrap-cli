import { Result, ResultErr, ResultOk } from "@polywrap/result";

// $start: UriConfig
/** URI configuration */
export interface UriConfig {
  /** URI Authority: allows the Polywrap URI resolution algorithm to determine an authoritative URI resolver. */
  authority: string;

  /** URI Path: tells the Authority where the Wrapper resides. */
  path: string;

  /** Full string representation of URI */
  uri: string;
}
// $end

// $start: Uri
/**
 * A Polywrap URI. Some examples of valid URIs are:
 * wrap://ipfs/QmHASH
 * wrap://ens/sub.dimain.eth
 * wrap://fs/directory/file.txt
 * wrap://uns/domain.crypto
 *
 * Breaking down the various parts of the URI, as it applies
 * to [the URI standard](https://tools.ietf.org/html/rfc3986#section-3):
 * **wrap://** - URI Scheme: differentiates Polywrap URIs.
 * **ipfs/** - URI Authority: allows the Polywrap URI resolution algorithm to determine an authoritative URI resolver.
 * **sub.domain.eth** - URI Path: tells the Authority where the Wrapper resides.
 */
export class Uri {
  // $end
  private _config: UriConfig;

  // $start: Uri-authority
  /** @returns Uri authority */
  public get authority(): string /* $ */ {
    return this._config.authority;
  }

  // $start: Uri-path
  /** @returns Uri path */
  public get path(): string /* $ */ {
    return this._config.path;
  }

  // $start: Uri-uri
  /** @returns Uri string representation */
  public get uri(): string /* $ */ {
    return this._config.uri;
  }

  // $start: Uri-constructor
  /**
   * Construct a Uri instance from a wrap URI string
   *
   * @remarks
   * Throws if URI string is invalid
   *
   * @param uri - a string representation of a wrap URI
   */
  constructor(uri: string) /* $ */ {
    const result = Uri.parseUri(uri);
    if (!result.ok) {
      throw result.error;
    }
    this._config = result.value;
  }

  // $start: Uri-equals
  /** Test two Uri instances for equality */
  public static equals(a: Uri, b: Uri): boolean /* $ */ {
    return a.uri === b.uri;
  }

  // $start: Uri-isUri
  /**
   * Check if a value is an instance of Uri
   *
   * @param value - value to check
   * @returns true if value is a Uri instance */
  public static isUri(value: unknown): value is Uri /* $ */ {
    return typeof value === "object" && (value as Uri).uri !== undefined;
  }

  // $start: Uri-isValidUri
  /**
   * Test if a URI string is a valid wrap URI
   *
   * @param uri - URI string
   * @param parsed? - UriConfig to update (mutate) with content of URI string
   * @returns true if input string is a valid wrap URI */
  public static isValidUri(uri: string, parsed?: UriConfig): boolean /* $ */ {
    const result = Uri.parseUri(uri);

    if (parsed && result.ok) {
      Object.assign(parsed, result.value);
    }

    return result.ok;
  }

  // $start: Uri-parseUri
  /**
   * Parse a wrap URI string into its authority and path
   *
   * @param uri - a string representation of a wrap URI
   * @returns A Result containing a UriConfig, if successful, or an error
   */
  public static parseUri(uri: string): Result<UriConfig, Error> /* $ */ {
    if (!uri) {
      return ResultErr(Error("The provided URI is empty"));
    }

    let processed = uri;

    // Trim preceding '/' characters
    while (processed[0] === "/") {
      processed = processed.substring(1);
    }

    // Check for the wrap:// scheme, add if it isn't there
    const wrapSchemeIdx = processed.indexOf("wrap://");

    // If it's missing the wrap:// scheme, add it
    if (wrapSchemeIdx === -1) {
      processed = "wrap://" + processed;
    }

    // If the wrap:// is not in the beginning, return an error
    if (wrapSchemeIdx > -1 && wrapSchemeIdx !== 0) {
      return ResultErr(
        Error("The wrap:// scheme must be at the beginning of the URI string")
      );
    }

    // Extract the authoriy & path
    let result = processed.match(/wrap:\/\/([a-z][a-z0-9-_]+)\/(.*)/);

    // Remove all empty strings
    if (result) {
      result = result.filter((str) => !!str);
    }

    if (!result || result.length !== 3) {
      return ResultErr(
        Error(
          `URI is malformed, here are some examples of valid URIs:\n` +
            `wrap://ipfs/QmHASH\n` +
            `wrap://ens/domain.eth\n` +
            `ens/domain.eth\n\n` +
            `Invalid URI Received: ${uri}`
        )
      );
    }

    return ResultOk({
      uri: processed,
      authority: result[1],
      path: result[2],
    });
  }

  // $start: Uri-from
  /**
   * Construct a Uri instance from a Uri or a wrap URI string
   *
   * @remarks
   * Throws if URI string is invalid
   *
   * @param uri - a Uri instance or a string representation of a wrap URI
   */
  public static from(uri: Uri | string): Uri /* $ */ {
    if (typeof uri === "string") {
      return new Uri(uri);
    } else if (Uri.isUri(uri)) {
      return uri;
    } else {
      throw Error(`Unknown uri type, cannot convert. ${JSON.stringify(uri)}`);
    }
  }

  // $start: Uri-toString
  /** @returns Uri string representation */
  public toString(): string /* $ */ {
    return this._config.uri;
  }

  // $start: Uri-toJSON
  /** @returns Uri string representation */
  public toJSON(): string /* $ */ {
    return this._config.uri;
  }
}
