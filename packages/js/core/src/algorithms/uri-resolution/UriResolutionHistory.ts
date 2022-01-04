export class UriResolutionHistory {
  stack: { sourceUri: string; resolver: string }[] = [];
  getResolvers(): string[] {
    return this.stack.map(({ resolver }) => resolver);
  }
}
