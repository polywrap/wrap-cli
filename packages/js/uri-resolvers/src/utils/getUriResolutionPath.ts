import { IUriResolutionStep } from "@polywrap/core-js";

export const getUriResolutionPath = (
  history: IUriResolutionStep<unknown>[]
): IUriResolutionStep<unknown>[] => {
  return history
    .filter((x) => {
      if (!x.result.ok) {
        return true;
      }

      const uriPackageOrWrapper = x.result.value;

      if (uriPackageOrWrapper.type === "uri") {
        return uriPackageOrWrapper.uri.uri !== x.sourceUri.uri;
      } else if (uriPackageOrWrapper.type === "package") {
        return true;
      } else if (uriPackageOrWrapper.type === "wrapper") {
        return true;
      }

      return false;
    })
    .map((x) => {
      if (x.subHistory && x.subHistory.length) {
        return {
          ...x,
          subHistory: getUriResolutionPath(x.subHistory),
        };
      } else {
        return x;
      }
    });
};
