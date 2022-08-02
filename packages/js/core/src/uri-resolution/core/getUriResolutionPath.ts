import { IUriResolutionStep } from ".";

export const getUriResolutionPath = (
  history: IUriResolutionStep[]
): IUriResolutionStep[] => {
  return history.filter(
    (x) => x.sourceUri.uri !== x.result.uri.uri || x.result.wrapper
  );
};
