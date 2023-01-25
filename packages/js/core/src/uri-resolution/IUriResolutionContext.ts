import { IUriResolutionStep } from "./IUriResolutionStep";
import { Uri } from "..";

// $start: IUriResolutionContext
/** Track and output URI resolution state, path, and history */
export interface IUriResolutionContext {
  /**
   * Check if a URI is in the process of being resolved
   *
   * @param uri - URI to check
   * @return true if URI resolution is in process, false otherwise
   */
  isResolving(uri: Uri): boolean;

  /**
   * Start resolving a URI
   *
   * @param uri - Uri to resolve
   */
  startResolving(uri: Uri): void;

  /**
   * Stop resolving a URI
   *
   * @param uri - Uri being resolved
   */
  stopResolving(uri: Uri): void;

  /**
   * Push a step onto the resolution history stack
   *
   * @param step - A completed resolution step
   */
  trackStep<TError>(step: IUriResolutionStep<TError>): void;

  /** @return history of all URI resolution steps completed */
  getHistory(): IUriResolutionStep<unknown>[];

  /** @return current URI resolution path */
  getResolutionPath(): Uri[];

  /**
   * Create a new resolution context using the current URI resolution path
   *
   * @return a UriResolutionContext
   */
  createSubHistoryContext(): IUriResolutionContext;

  /**
   * Create a new resolution context using the current URI resolution history
   *
   * @return a UriResolutionContext
   */
  createSubContext(): IUriResolutionContext;
}
// $end
