import { CleanResolutionStep } from "./CleanResolutionStep";

import { IUriResolutionStep } from "@polywrap/core-js";

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
              `${step.sourceUri.uri} => ${step.description ?? ""}`
            );
          } else {
            cleanHistory.push(
              `${step.sourceUri.uri} => ${step.description ?? ""} => uri (${
                uriPackageOrWrapper.uri.uri
              })`
            );
          }
          break;
        case "package":
          cleanHistory.push(
            `${step.sourceUri.uri} => ${step.description ?? ""} => package (${
              uriPackageOrWrapper.package.uri.uri
            })`
          );
          break;
        case "wrapper":
          cleanHistory.push(
            `${step.sourceUri.uri} => ${
              step.description ? "" : ""
            } => wrapper (${uriPackageOrWrapper.wrapper.uri.uri})`
          );
          break;
      }
    } else {
      cleanHistory.push(
        `${step.sourceUri.uri} => ${step.description ?? ""} => error`
      );
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
