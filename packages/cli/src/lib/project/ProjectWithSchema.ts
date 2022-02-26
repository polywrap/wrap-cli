import { Project } from "./Project";

export abstract class ProjectWithSchema<TManifest> extends Project<TManifest> {

  /// Abstract Interface

  public abstract getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }>;

  public abstract getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  >;
}
