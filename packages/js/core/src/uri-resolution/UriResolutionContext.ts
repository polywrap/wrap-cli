import { IUriResolutionStep } from "./IUriResolutionStep";
import { IUriResolutionContext } from "./IUriResolutionContext";
import { Uri } from "../types";
import { NestedUriResolutionContext } from "./NestedUriResolutionContext";

export class UriResolutionContext implements IUriResolutionContext {
  private visitedUriMap: Map<string, boolean>;
  private history: IUriResolutionStep<unknown>[];

  constructor() {
    this.visitedUriMap = new Map();
    this.history = [];
  }

  static createNested(context: IUriResolutionContext): IUriResolutionContext {
    return new NestedUriResolutionContext(context);
  }

  hasVisited(uri: Uri): boolean {
    return !!this.visitedUriMap.get(uri.toString());
  }

  visit(uri: Uri): void {
    this.visitedUriMap.set(uri.toString(), true);
  }

  unvisit(uri: Uri): void {
    this.visitedUriMap.delete(uri.toString());
  }

  trackStep<TError>(step: IUriResolutionStep<TError>): void {
    this.history.push(step);
  }

  getHistory(): IUriResolutionStep<unknown>[] {
    return this.history;
  }

  getVisitedUris(): Uri[] {
    return [...this.visitedUriMap.keys()].map((x) => new Uri(x));
  }
}
