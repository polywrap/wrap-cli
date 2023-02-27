import { IUriResolver } from "@polywrap/core-js";
import {
  PackageResolver,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  RedirectResolver,
  StaticResolver,
  WrapperCache,
} from "../build";
import { WrapperResolver } from "../build/wrappers";

export function example(): IUriResolver<unknown> {
  const redirects: RedirectResolver[] = [];
  const wrappers: WrapperResolver[] = [];
  const packages: PackageResolver[] = [];
  // $start: quickstart-example
  const resolver = RecursiveResolver.from(
      PackageToWrapperCacheResolver.from(
        [
          StaticResolver.from([
              ...redirects,
              ...wrappers,
              ...packages,
            ]),
          ],
          new WrapperCache()
        )
      );
  // $end

  return resolver;
}
