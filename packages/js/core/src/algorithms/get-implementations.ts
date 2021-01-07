import {
  Uri,
  UriRedirect,
  PluginPackage
} from "../types";

export function getImplementations(
  abstractApi: Uri,
  redirects: UriRedirect[]
): (Uri | PluginPackage)[] {

  const result: (Uri | PluginPackage)[] = [];

  for (const redirect of redirects) {

    // Explicit check
    if (Uri.isUri(redirect.from)) {
      if (Uri.equals(redirect.from, abstractApi)) {
        result.push(redirect.to);
      }
    }
    // Regex check
    else if (abstractApi.matches(redirect.from)) {
      result.push(redirect.to);
    }
    // Plugin implemented check
    else if (!Uri.isUri(redirect.to)) {
      const { implemented } = redirect.to.manifest;
      const implementedApi = implemented.findIndex(
        (uri) => Uri.equals(uri, abstractApi)
      ) > -1;

      if (implementedApi) {
        result.push(redirect.to);
      }
    }
  }

  return result;
}
