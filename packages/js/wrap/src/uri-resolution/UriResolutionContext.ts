import { Uri, UriResolutionStep } from ".";

// $start: UriResolutionContext
/** Track and output URI resolution state, path, and history */
export class UriResolutionContext implements UriResolutionContext {
  // $end
  private _resolvingUriMap: Map<string, boolean>;
  private _resolutionPath: Set<string>;
  private _history: UriResolutionStep<unknown>[];

  // $start: UriResolutionContext-constructor
  /** Construct a UriResolutionContext */
  constructor();
  constructor(
    resolvingUriMap: Map<string, boolean>,
    resolutionPath: Set<string>
  );
  constructor(
    resolvingUriMap: Map<string, boolean>,
    history: UriResolutionStep<unknown>[]
  );
  constructor(
    resolvingUriMap?: Map<string, boolean>,
    resolutionPathOrHistory?: Set<string> | UriResolutionStep<unknown>[]
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

  /**
   * Check if a URI is in the process of being resolved
   *
   * @param uri - URI to check
   * @return true if URI resolution is in process, false otherwise
   */
  isResolving(uri: Uri): boolean {
    return !!this._resolvingUriMap.get(uri.toString());
  }

  /**
   * Start resolving a URI
   *
   * @param uri - Uri to resolve
   */
  startResolving(uri: Uri): void {
    this._resolvingUriMap.set(uri.toString(), true);
    this._resolutionPath.add(uri.toString());
  }

  /**
   * Stop resolving a URI
   *
   * @param uri - Uri being resolved
   */
  stopResolving(uri: Uri): void {
    this._resolvingUriMap.delete(uri.toString());
  }

  /**
   * Push a step onto the resolution history stack
   *
   * @param step - A completed resolution step
   */
  trackStep<TError>(step: UriResolutionStep<TError>): void {
    this._history.push(step);
  }

  /** @return history of all URI resolution steps completed */
  getHistory(): UriResolutionStep<unknown>[] {
    return this._history;
  }

  /** @return current URI resolution path */
  getResolutionPath(): Uri[] {
    return [...this._resolutionPath].map((x) => new Uri(x));
  }

  /**
   * Create a new resolution context using the current URI resolution path
   *
   * @return a UriResolutionContext
   */
  createSubHistoryContext(): UriResolutionContext {
    return new UriResolutionContext(
      this._resolvingUriMap,
      this._resolutionPath
    );
  }

  /**
   * Create a new resolution context using the current URI resolution history
   *
   * @return a UriResolutionContext
   */
  createSubContext(): UriResolutionContext {
    return new UriResolutionContext(this._resolvingUriMap, this._history);
  }
}
