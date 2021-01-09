import { Uri, PluginPackage } from ".";

/**
 * Redirect from one URI, or a set of URIs, to a new URI or a plugin.
 */
export interface UriRedirect {
  /** Redirect from this URI */
  from: Uri;

  /** The destination URI, or plugin, that will now handle the invocation. */
  // TODO: it's more "proper" to separate plugins from UriRedirects. Make plugins: a separate config option which takes a { uri, pluginpackage }
  // TODO: currently UriRedirects are used for: plugins, implementations, and redirects. This is either elegant, or confusing...
  //       Should look at what it looks like to seperate these.
  to: Uri | PluginPackage;
}
