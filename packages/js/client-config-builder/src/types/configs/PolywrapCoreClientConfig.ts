import { GenericEnv, GenericInterfaceImplementations } from "./types";

import { IUriResolver, Uri } from "@polywrap/core-js";
import { TracerConfig } from "@polywrap/tracing-js";
import { IWrapperCache } from "@polywrap/uri-resolvers-js";

export interface PolywrapCoreClientConfig<
  TUri extends Uri | string = Uri | string
> {
  readonly interfaces?: Readonly<GenericInterfaceImplementations<TUri>[]>;
  readonly envs?: Readonly<GenericEnv<TUri>[]>;
  readonly resolver: Readonly<IUriResolver<unknown>>;
  readonly wrapperCache?: IWrapperCache;
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
