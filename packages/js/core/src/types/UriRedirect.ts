import {
  Uri,
  Plugin
} from ".";

/**
 * Redirect from one URI, or a set of URIs, to a new URI or a plugin.
 */
export interface UriRedirect {
  /** Redirect from this URI, or set of URIs specified by the regex. */
  from: Uri | RegExp;

  /** The destination URI, or plugin, that will now handle the invocation. */
  to: Uri | (() => Plugin);
}
