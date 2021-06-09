import {
  Uri,
  UriRedirect,
  InterfaceImplementations,
  QueryHandler,
  InvokeHandler,
} from "./";
import { PluginRegistration } from "./PluginRegistration";

export interface Client extends QueryHandler, InvokeHandler {
  redirects: () => readonly UriRedirect<Uri>[];
  plugins: () => readonly PluginRegistration<Uri>[];
  interfaces: () => readonly InterfaceImplementations<Uri>[];
}
