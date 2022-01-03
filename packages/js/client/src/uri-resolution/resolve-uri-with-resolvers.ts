import { Uri, Api, UriToApiResolver } from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";
import { ResolveUriError } from "./ResolveUriError";
import { UriResolutionHistory } from "./UriResolutionHistory";

type UriHistoryStack = { resolvedUri: string; resolver: string }[];

const trackUriRedirect = (
    uri: string, 
    resolver: string, 
    uriHistory: UriHistoryStack
  ) => {
  if (
    uriHistory.some((item) => item.resolvedUri === uri)
  ) {
    return {
      infiniteLoopDetected: true
    };
  }

  uriHistory.push({
    resolvedUri: uri,
    resolver,
  });

  return {
    infiniteLoopDetected: false
  };
};

//Transforms the URI history array into a more readable format
//Instead of tracking the resulting(resolved) URI for each resolver
//We track the source URI for each resolver
const createResolutionHistory = (uriHistory: UriHistoryStack): UriResolutionHistory => {
  const history: UriResolutionHistory = new UriResolutionHistory();

  if(!uriHistory.length) {
    return history;
  }

  let currentUri = uriHistory[0].resolvedUri;

  for(let i = 1; i < uriHistory.length; i++) {
    history.stack.push({
      sourceUri: currentUri,
      resolver: uriHistory[i].resolver
    });

    currentUri = uriHistory[i].resolvedUri;
  }

  return history;
};

export const resolveUriWithResolvers = async (uri: Uri, uriResolvers: UriToApiResolver[]): Promise<{
  uri?: Uri;
  api?: Api;
  uriHistory: UriResolutionHistory,
  error?: ResolveUriError
}> => {
  // Keep track of past URIs to avoid infinite loops
  const uriHistory: UriHistoryStack = [];
  uriHistory.push(
    {
      resolvedUri: uri.uri,
      resolver: "ROOT",
    },
  );

  let currentUri: Uri = uri;
  let api: Api | undefined;

  let runAgain = true;

  while(runAgain) {
    runAgain = false;

    for (const uriResolver of uriResolvers) {
      const result = await uriResolver.resolveUri(currentUri);

      if(result.api) {
        api = result.api;

        trackUriRedirect("api", uriResolver.name, uriHistory);
       
        Tracer.addEvent("uri-resolver-redirect", {
          from: currentUri.uri,
          to: "api",
        });

        break;
      }
      else if(result.uri && result.uri.uri !== currentUri.uri) {
        const { infiniteLoopDetected } = trackUriRedirect(result.uri.uri, uriResolver.name, uriHistory);
      
        if(infiniteLoopDetected) {
          return {
            uri: currentUri,
            api,
            uriHistory: createResolutionHistory(uriHistory),
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
    uriHistory: createResolutionHistory(uriHistory)
  };
};