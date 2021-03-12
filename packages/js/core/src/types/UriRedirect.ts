import { PluginPackage, Uri } from ".";

export interface UriRedirect {
  /** Redirect from this URI */
  from: Uri;

  /** The destination URI, or plugin, that will now handle the invocation. */
  // TODO: currently UriRedirects are used for: plugins, implementations, and redirects. This is either elegant, or confusing...
  //       Should look at what it looks like to seperate these.
  to: Uri | PluginPackage;
}

/**
 * Redirect from one URI, or a set of URIs, to a new URI or a plugin.
 */
export interface UriRedirectDefinition {
  /** Redirect from this URI */
  from: string;

  /** The destination URI, or plugin, that will now handle the invocation. */
  to: string | PluginPackage;
}

export function convertToUriRedirects(
  redirectDefinitions: UriRedirectDefinition[]
): UriRedirect[] {
  const redirects: UriRedirect[] = [];
  for (const definition of redirectDefinitions) {
    const from = new Uri(definition.from);
    const to =
      typeof definition.to === "string"
        ? new Uri(definition.to)
        : definition.to;

    redirects.push({
      from: from,
      to: to,
    });
  }

  return redirects;
}
