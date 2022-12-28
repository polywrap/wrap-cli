import { IUriResolutionStep } from "./IUriResolutionStep";
import { IUriResolutionContext } from "./IUriResolutionContext";
import { Uri } from "../types";

// $start: UriResolutionContext
/** An implementation of the IUriResolutionContext interface */
export class UriResolutionContext implements IUriResolutionContext {
  // $end
  private resolvingUriMap: Map<string, boolean>;
  private resolutionPath: Set<string>;
  private history: IUriResolutionStep<unknown>[];

  // $start: UriResolutionContext-constructor
  /** Construct a UriResolutionContext */
  constructor();
  constructor(
    resolvingUriMap: Map<string, boolean>,
    resolutionPath: Set<string>
  );
  constructor(
    resolvingUriMap: Map<string, boolean>,
    history: IUriResolutionStep<unknown>[]
  );
  constructor(
    resolvingUriMap?: Map<string, boolean>,
    resolutionPathOrHistory?: Set<string> | IUriResolutionStep<unknown>[]
  ) {
    // $end
    this.resolvingUriMap = resolvingUriMap ?? new Map();

    if (Array.isArray(resolutionPathOrHistory)) {
      this.resolutionPath = new Set();
      this.history = resolutionPathOrHistory;
    } else if (resolutionPathOrHistory instanceof Set) {
      this.resolutionPath = resolutionPathOrHistory;
      this.history = [];
    } else {
      this.resolutionPath = new Set();
      this.history = [];
    }
  }

  isResolving(uri: Uri): boolean {
    return !!this.resolvingUriMap.get(uri.toString());
  }

  startResolving(uri: Uri): void {
    this.resolvingUriMap.set(uri.toString(), true);
    this.resolutionPath.add(uri.toString());
  }

  stopResolving(uri: Uri): void {
    this.resolvingUriMap.delete(uri.toString());
  }

  trackStep<TError>(step: IUriResolutionStep<TError>): void {
    this.history.push(step);
  }

  getHistory(): IUriResolutionStep<unknown>[] {
    return this.history;
  }

  getResolutionPath(): Uri[] {
    return [...this.resolutionPath].map((x) => new Uri(x));
  }

  createSubHistoryContext(): IUriResolutionContext {
    return new UriResolutionContext(this.resolvingUriMap, this.resolutionPath);
  }

  createSubContext(): IUriResolutionContext {
    return new UriResolutionContext(this.resolvingUriMap, this.history);
  }
}
