import { Uri, Api, UriToApiResolver } from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export enum ResolveUriError {
  InfiniteLoop
}

export class UriResolutionHistory {
  stack: { uri: string; resolver: string }[] = [];
  getResolvers(): string[] {
    return this.stack.map(({ resolver }) => resolver);
  }
}

export const resolveUriWithResolvers = async (uri: Uri, uriResolvers: UriToApiResolver[]): Promise<{
  uri?: Uri;
  api?: Api;
  uriHistory: UriResolutionHistory,
  error?: ResolveUriError
}> => {
  // Keep track of past URIs to avoid infinite loops
  const uriHistory: UriResolutionHistory = new UriResolutionHistory();
  uriHistory.stack.push(
    {
      uri: uri.uri,
      resolver: "ROOT",
    },
  );

  const trackUriRedirect = (uri: string, resolver: string) => {
    if (
      uriHistory.stack.some((item) => item.uri === uri)
    ) {
      return {
        infiniteLoopDetected: true
      };
    }

    uriHistory.stack.push({
      uri,
      resolver,
    });

    return {
      infiniteLoopDetected: false
    };
  };
  
  let currentUri: Uri = uri;
  let api: Api | undefined;

  let runAgain = true;

  while(runAgain) {
    runAgain = false;

    for (const uriResolver of uriResolvers) {
      const result = await uriResolver.resolveUri(currentUri);

      if(result.api) {
        api = result.api;
        break;
      }
      else if(result.uri && result.uri.uri !== currentUri.uri) {
        const { infiniteLoopDetected } = trackUriRedirect(result.uri.uri, uriResolver.name);
      
        if(infiniteLoopDetected) {
          return {
            uri: currentUri,
            api,
            uriHistory,
            error: infiniteLoopDetected ? ResolveUriError.InfiniteLoop : undefined,
          };
        }
       
        Tracer.addEvent("uri-resolver-redirect", {
          from: currentUri.uri,
          to: result.uri.uri,
        });

        currentUri = result.uri;
        runAgain = true;
        break;
      }
    }
  }

  return {
    uri: currentUri,
    api,
    uriHistory
  };
};