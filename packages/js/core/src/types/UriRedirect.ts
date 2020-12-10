import {
  Uri,
  Plugin
} from ".";

export interface UriRedirect {
  from: Uri | RegExp;
  to: Uri | (() => Plugin);
}
