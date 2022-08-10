import { IUriResolutionStep } from ".";
import { Uri } from "../..";

export const getUriResolutionPath = (
  history: IUriResolutionStep[]
): IUriResolutionStep[] => {
  return history.filter((x) => {
    let resultUri: Uri | undefined;
    if (!x.result.ok) {
      return true;
    }

    if (x.result.value.uri()) {
      resultUri = x.result.value.uri();
    } else if (x.result.value.wrapper()) {
      resultUri = x.result.value.wrapper()?.uri;
    } else if (x.result.value.package()) {
      return true;
    }

    return !resultUri || resultUri.uri !== x.sourceUri.uri;
  });
};
