export interface Middleware {
  /**
   * Invoked before each CLI command to determine whether run(...) should be called.
   * The middleware will run if check returns true or is undefined.
   *
   * @param sharedState A state object shared by all middleware and accessible
   * in the CLI.
   */
  check?: (
    command: CommandInput,
    sharedState: SharedMiddlewareState
  ) => boolean;
  /**
   * May be invoked by MiddlewareManager before each CLI command.
   *
   * @param sharedState A state object shared by all middleware and accessible
   * in the CLI.
   */
  run: (
    command: CommandInput,
    sharedState: SharedMiddlewareState
  ) => Promise<Partial<SharedMiddlewareState>>;
}

export type SharedMiddlewareState = {
  [p: string]: unknown;
  // dockerPath: string;
  // myMiddleware: MyMiddlewareState;
};

export interface CommandInput {
  name: string;
  options: Record<string, unknown>;
}
