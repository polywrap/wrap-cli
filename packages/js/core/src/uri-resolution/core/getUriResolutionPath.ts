import { IUriResolutionStep } from ".";
import { Uri } from "../..";

export const getUriResolutionPath = (
  history: IUriResolutionStep<unknown>[]
): IUriResolutionStep<unknown>[] => {
  return history.filter((x) => {
    let resultUri: Uri | undefined;
    if (!x.result.response.ok) {
      return true;
    }

    const uriWrapperOrPackage = x.result.response.value;

    if (uriWrapperOrPackage.uri) {
      resultUri = uriWrapperOrPackage.uri;
    } else if (uriWrapperOrPackage.wrapper) {
      resultUri = uriWrapperOrPackage.wrapper?.uri;
    } else if (uriWrapperOrPackage.package) {
      resultUri = uriWrapperOrPackage.package?.uri;
    }

    return !resultUri || resultUri.uri !== x.sourceUri.uri;
  });
};
