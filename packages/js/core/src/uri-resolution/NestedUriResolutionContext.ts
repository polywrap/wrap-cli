import { IUriResolutionContext } from "./IUriResolutionContext";
import { IUriResolutionStep } from "./IUriResolutionStep";

import { Uri } from "..";

export class NestedUriResolutionContext implements IUriResolutionContext {
  private subHistory: IUriResolutionStep<unknown>[];
  constructor(private readonly resolutionContext: IUriResolutionContext) {
    this.subHistory = [];
  }

  hasVisited(uri: Uri): boolean {
    return this.resolutionContext.hasVisited(uri);
  }

  visit(uri: Uri): void {
    this.resolutionContext.visit(uri);
  }

  unvisit(uri: Uri): void {
    this.resolutionContext.unvisit(uri);
  }

  trackStep<TError>(step: IUriResolutionStep<TError>): void {
    this.subHistory.push(step);
  }

  getHistory(): IUriResolutionStep<unknown>[] {
    return this.subHistory;
  }

  getVisitedUris(): Uri[] {
    return this.resolutionContext.getVisitedUris();
  }
}
