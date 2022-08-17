import { IUriResolutionStep } from "@polywrap/core-js";
import { CleanResolutionStep } from "./CleanResolutionStep";

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
    if (step.response.result.ok) {
      const uriPackageOrWrapper = step.response.result.value;

      switch (uriPackageOrWrapper.type) {
        case "uri":
          if (step.sourceUri.uri === uriPackageOrWrapper.uri.uri) {
            cleanHistory.push(`${step.sourceUri.uri} => ${step.resolverName}`);
          } else {
            cleanHistory.push(
              `${step.sourceUri.uri} => ${step.resolverName} => uri (${uriPackageOrWrapper.uri.uri})`
            );
          }
          break;
        case "package":
          cleanHistory.push(
            `${step.sourceUri.uri} => ${step.resolverName} => package (${uriPackageOrWrapper.package.uri.uri})`
          );
          break;
        case "wrapper":
          cleanHistory.push(
            `${step.sourceUri.uri} => ${step.resolverName} => wrapper (${uriPackageOrWrapper.wrapper.uri.uri})`
          );
          break;
      }
    } else {
      cleanHistory.push(
        `${step.sourceUri.uri} => ${step.resolverName} => error`
      );
    }

    if (
      !step.response.history ||
      step.response.history.length === 0 ||
      (depth != null && depth < 0)
    ) {
      continue;
    }

    const subHistory = buildCleanUriHistory(step.response.history, depth);
    if (subHistory.length > 0) {
      cleanHistory.push(subHistory);
    }
  }

  return cleanHistory;
};
