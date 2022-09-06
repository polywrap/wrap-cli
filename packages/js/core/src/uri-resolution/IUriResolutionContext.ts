import { IUriResolutionStep } from "./IUriResolutionStep";
import { Uri } from "..";

export interface IUriResolutionContext {
  hasVisited(uri: Uri): boolean;
  visit(uri: Uri): void;
  unvisit(uri: Uri): void;
  trackStep<TError>(step: IUriResolutionStep<TError>): void;
  getHistory(): IUriResolutionStep<unknown>[];
  getVisitedUris(): Uri[];
}
