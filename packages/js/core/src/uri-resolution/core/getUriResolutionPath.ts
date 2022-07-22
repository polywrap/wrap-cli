import { UriResolutionStep } from ".";

export const getUriResolutionPath = (
  history: UriResolutionStep[]
): UriResolutionStep[] => {
  return history.filter(
    (x) => x.sourceUri.uri !== x.result.uri.uri || x.result.wrapper
  );
};
