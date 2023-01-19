import { IUriResolutionStep } from "./IUriResolutionStep";
import { IUriResolutionContext } from "./IUriResolutionContext";
import { Uri } from "../types";

// $start: UriResolutionContext
/** An implementation of the IUriResolutionContext interface */
// $start: UriResolutionContext
/** An implementation of the IUriResolutionContext interface */
export class UriResolutionContext implements IUriResolutionContext {
  // $end
  private _resolvingUriMap: Map<string, boolean>;
  private _resolutionPath: Set<string>;
  private _history: IUriResolutionStep<unknown>[];

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
  ) /* $ */ {
    this._resolvingUriMap = resolvingUriMap ?? new Map();

    if (Array.isArray(resolutionPathOrHistory)) {
      this._resolutionPath = new Set();
      this._history = resolutionPathOrHistory;
    } else if (resolutionPathOrHistory instanceof Set) {
      this._resolutionPath = resolutionPathOrHistory;
      this._history = [];
    } else {
      this._resolutionPath = new Set();
      this._history = [];
    }
  }

  isResolving(uri: Uri): boolean {
    return !!this._resolvingUriMap.get(uri.toString());
  }

  startResolving(uri: Uri): void {
    this._resolvingUriMap.set(uri.toString(), true);
    this._resolutionPath.add(uri.toString());
  }

  stopResolving(uri: Uri): void {
    this._resolvingUriMap.delete(uri.toString());
  }

  trackStep<TError>(step: IUriResolutionStep<TError>): void {
    this._history.push(step);
  }

  getHistory(): IUriResolutionStep<unknown>[] {
    return this._history;
  }

  getResolutionPath(): Uri[] {
    return [...this._resolutionPath].map((x) => new Uri(x));
  }

  createSubHistoryContext(): IUriResolutionContext {
    return new UriResolutionContext(
      this._resolvingUriMap,
      this._resolutionPath
    );
  }

  createSubContext(): IUriResolutionContext {
    return new UriResolutionContext(this._resolvingUriMap, this._history);
  }
}
