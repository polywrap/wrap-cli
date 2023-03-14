import { Invoker } from "../invoke";
import { UriResolutionClient } from "../uri-resolution";

export interface WrapClient extends Invoker, UriResolutionClient<unknown> { }
