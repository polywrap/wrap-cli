import { IUriResolutionStep } from "./IUriResolutionStep";
import { Uri } from "..";

export interface IUriResolutionContext {
  isResolving(uri: Uri): boolean;
  startResolving(uri: Uri): void;
  stopResolving(uri: Uri): void;
  trackStep<TError>(step: IUriResolutionStep<TError>): void;
  getHistory(): IUriResolutionStep<unknown>[];
  getResolutionPath(): Uri[];
  createSubHistoryContext(): IUriResolutionContext;
  createSubContext(): IUriResolutionContext;
}
