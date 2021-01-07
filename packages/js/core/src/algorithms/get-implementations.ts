import {
  Uri,
  UriRedirect,
  PluginFactory
} from "../types";

// TODO:
// - Plugin
// - Manifest
// - - schema = schema = graphql document | string
// - - implements = ["...", "...", "..."]
// - - imports = ["...", "..."]

// Redirect
// uri => { PluginFactory, PluginManifest }


export function getImplementations(
  abstractApi: Uri,
  redirects: UriRedirect[]
): (Uri | PluginFactory)[] {

  const result: (Uri | PluginFactory)[] = [];

  for (const redirect of redirects) {

    // Explicit check
    if (Uri.isUri(redirect.from)) {
      if (Uri.equals(redirect.from, abstractApi)) {
        // TODO: add redirect.to
      }
    }
    // Regex check
    else if (abstractApi.matches(redirect.from)) {
      // TODO: add redirect.to
    }
    // Plugin implements check
    else if (!Uri.isUri(redirect.to)) {
      const { implements } = redirect.to.manifest;
      const implementsApi = implements.findIndex(
        (uri) => uri.equals(abstractApi)
      ) > -1;

      if (implementsApi) {
        result.push(redirect.to.factory);
      }
    }
  }

  return [];
}
