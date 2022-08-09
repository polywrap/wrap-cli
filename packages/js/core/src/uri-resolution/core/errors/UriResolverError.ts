export class UriResolverError<TError> {
  constructor(
    public readonly resolverName: string,
    public readonly error: TError
  ) {}
}
