import { UriResolutionStep } from "@polywrap/wrap-js";

// $start: getUriResolutionPath
/**
 * Get a resolution path from the history of a URI resolution attempt
 *
 * @param history - the resolution context
 * @returns the URI's resolution path
 * */
export const getUriResolutionPath = (
  history: UriResolutionStep<unknown>[]
): UriResolutionStep<unknown>[] /* $ */ => {
  // Get all non-empty items from the resolution history
  return (
    history
      .filter((x) => {
        // If a failure happened
        if (!x.result.ok) {
          return true;
        }

        const uriPackageOrWrapper = x.result.value;

        if (uriPackageOrWrapper.type === "uri") {
          // If a redirect has occured
          return uriPackageOrWrapper.uri.uri !== x.sourceUri.uri;
        } else if (uriPackageOrWrapper.type === "package") {
          // If a package was returned
          return true;
        } else if (uriPackageOrWrapper.type === "wrapper") {
          // If a wrapper was returned
          return true;
        }

        return false;
      })
      // Filter all sub-history
      .map((x) => {
        if (x.subHistory && x.subHistory.length) {
          return {
            ...x,
            subHistory: getUriResolutionPath(x.subHistory),
          };
        } else {
          return x;
        }
      })
  );
};
