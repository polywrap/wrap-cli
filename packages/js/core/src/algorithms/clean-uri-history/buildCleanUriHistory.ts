import { CleanResolutionStep } from "./CleanResolutionStep";
import { IUriResolutionStep } from "../..";

export const buildCleanUriHistory = (
  history: IUriResolutionStep<unknown>[],
  depth?: number
): CleanResolutionStep => {
  const cleanHistory: CleanResolutionStep = [];

  if (depth != null) {
    depth--;
  }

  if (!history) {
    return cleanHistory;
  }
  for (const step of history) {
    if (step.result.ok) {
      const uriPackageOrWrapper = step.result.value;

      switch (uriPackageOrWrapper.type) {
        case "uri":
          if (step.sourceUri.uri === uriPackageOrWrapper.uri.uri) {
            cleanHistory.push(
              step.description
                ? `${step.sourceUri.uri} => ${step.description}`
                : `${step.sourceUri.uri}`
            );
          } else {
            cleanHistory.push(
              step.description
                ? `${step.sourceUri.uri} => ${step.description} => uri (${uriPackageOrWrapper.uri.uri})`
                : `${step.sourceUri.uri} => uri (${uriPackageOrWrapper.uri.uri})`
            );
          }
          break;
        case "package":
          cleanHistory.push(
            step.description
              ? `${step.sourceUri.uri} => ${step.description} => package (${uriPackageOrWrapper.uri.uri})`
              : `${step.sourceUri.uri} => package (${uriPackageOrWrapper.uri.uri})`
          );
          break;
        case "wrapper":
          cleanHistory.push(
            step.description
              ? `${step.sourceUri.uri} => ${step.description} => wrapper (${uriPackageOrWrapper.uri.uri})`
              : `${step.sourceUri.uri} => wrapper (${uriPackageOrWrapper.uri.uri})`
          );
          break;
      }
    } else {
      if (typeof step.result.error === "string") {
        cleanHistory.push(
          step.description
            ? `${step.sourceUri.uri} => ${step.description} => error ${step.result.error}`
            : `${step.sourceUri.uri} => error (${step.result.error})`
        );
      } else {
        cleanHistory.push(
          step.description
            ? `${step.sourceUri.uri} => ${step.description} => error`
            : `${step.sourceUri.uri} => error`
        );
      }
    }

    if (
      !step.subHistory ||
      step.subHistory.length === 0 ||
      (depth != null && depth < 0)
    ) {
      continue;
    }

    const subHistory = buildCleanUriHistory(step.subHistory, depth);
    if (subHistory.length > 0) {
      cleanHistory.push(subHistory);
    }
  }

  return cleanHistory;
};
