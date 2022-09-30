use uri::{ Uri };
use uri_resolution::{ UriResolutionContext };

struct TryResolveUriOptions {
  uri: Uri;
  resolution_context: Option<UriResolutionContext>;
}

/*
TODO
interface UriResolverHandler {
  tryResolveUri(
    options?: TryResolveUriOptions
  ) -> Future<Result<UriPackageOrWrapper, Error>>;
}
*/
