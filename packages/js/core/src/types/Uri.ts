/*
https://tools.ietf.org/html/rfc3986#section-3

Valid URIs:
w3://ipfs/QmHASH
w3://ens/sub.domain.eth
w3://fs/directory/file.ext
w3://uns/domain.crypto

TODO: modify + tests
*/
export class Uri {
  public readonly scheme: string;

  constructor(public readonly uri: string) {
    const result = uri.match(/([a-z][a-z0-9+\-.]*):\/\//g);

    if (!result || result.length === 0) {
      throw Error(
        `Uri is missing a scheme, please provide one followed by a ://.\n` +
        `Received: ${uri}\n` +
        `Common Schemes: ens://, ipfs://`
      );
    }

    // Remove the trailing '://'
    this.scheme = result[0].substr(0, result[0].length - 3);
  }

  public static isUri(value: object): value is Uri {
    return (value as Uri).uri !== undefined
  }
}
