export declare function up(
  quiet: boolean,
  configFilePath: string,
  ci: boolean,
  modules: string[]
): Promise<void>;
export declare function down(
  quiet: boolean,
  configFilePath: string,
  ci: boolean,
  modules: string[]
): Promise<void>;

export declare const modulesToDockerComposeFiles: Map<string, string>;
