import { Uri, IUriResolutionStep } from "@polywrap/core-js";

export const getUriResolutionPath = (
  history: IUriResolutionStep<unknown>[]
): IUriResolutionStep<unknown>[] => {
  return history.filter((x) => {
    if (!x.response.result.ok) {
      return true;
    }

    const uriPackageOrWrapper = x.response.result.value;
    let resultUri: Uri | undefined;

    if (uriPackageOrWrapper.type === "uri") {
      resultUri = uriPackageOrWrapper.uri;
    } else if (uriPackageOrWrapper.type === "package") {
      resultUri = uriPackageOrWrapper.package?.uri;
    } else if (uriPackageOrWrapper.type === "wrapper") {
      resultUri = uriPackageOrWrapper.wrapper.uri;
    }

    return !resultUri || resultUri.uri !== x.sourceUri.uri;
  });
};
