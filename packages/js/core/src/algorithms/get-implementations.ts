import {
  Uri,
  UriRedirect
} from "../types";

export function getImplementations(
  abstractApi: Uri,
  redirects: readonly UriRedirect[]
): Uri[] {

  const result: Uri[] = [];

  for (const redirect of redirects) {

    // Plugin implemented check
    if (!Uri.isUri(redirect.to)) {
      const { implemented } = redirect.to.manifest;
      const implementedApi = implemented.findIndex(
        (uri) => Uri.equals(uri, abstractApi)
      ) > -1;

      if (implementedApi) {
        result.push(redirect.from);
      }
    }
    // Explicit check
    else if (Uri.isUri(redirect.from)) {
      if (Uri.equals(redirect.from, abstractApi)) {
        result.push(redirect.to);
      }
    }
  }

  return result;
}
