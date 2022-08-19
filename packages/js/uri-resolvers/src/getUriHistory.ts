import { Uri, IUriResolutionStep } from "@polywrap/core-js";

export const getUriHistory = (
  history: IUriResolutionStep<unknown>[]
): Uri[] => {
  return history
    .map((x) => {
      if (!x.response.result.ok) {
        return undefined;
      }

      const uriPackageOrWrapper = x.response.result.value;
      let resultUri: Uri;

      if (uriPackageOrWrapper.type === "uri") {
        resultUri = uriPackageOrWrapper.uri;
      } else if (uriPackageOrWrapper.type === "package") {
        resultUri = uriPackageOrWrapper.package.uri;
      } else {
        resultUri = uriPackageOrWrapper.wrapper.uri;
      }

      return resultUri.uri !== x.sourceUri.uri ? resultUri : undefined;
    })
    .filter((x) => x) as Uri[];
};
