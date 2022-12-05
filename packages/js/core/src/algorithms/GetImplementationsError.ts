export class GetImplementationsError<TInternalError = unknown> extends Error {
  constructor(public readonly internalError: TInternalError) {
    super("Error occurred while getting implementations");
  }
}
