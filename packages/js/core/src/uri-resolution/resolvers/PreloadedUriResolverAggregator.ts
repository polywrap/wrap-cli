import {
  UriResolverAggregator,
  IUriResolver,
  IUriResolutionError,
} from "../core";

export class PreloadedUriResolverAggregator extends UriResolverAggregator {
  constructor(
    private readonly uriResolvers: IUriResolver[],
    options: { fullResolution: boolean }
  ) {
    super(options);
  }

  get name(): string {
    return UriResolverAggregator.name;
  }

  getUriResolvers(): Promise<IUriResolver[] | IUriResolutionError> {
    return Promise.resolve(this.uriResolvers);
  }
}
