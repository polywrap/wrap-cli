import * as Extensions from "./extension-modules";
import { Client, Uri, Extension, ExtensionConfig, SanitizedExtensionConfig } from "@web3api/core-js";

export class TestImport implements Extension {

  private client: Client;
  readonly buildUri: Uri = new Uri("testimport.uri.eth");
  readonly config: SanitizedExtensionConfig;
  readonly query: Extensions.TestImportQueryExtension;

  constructor(client: Client, config?: ExtensionConfig) {
    this.client = client;
    this.config = this.sanitizeConfig(config);
    this.query = new Extensions.TestImportQueryExtension(this.client, this.config.uri);
    this.validate();
  }

  private validate(): boolean {
    // Not implemented
    return true;
  }

  private sanitizeConfig(userConfig?: ExtensionConfig): SanitizedExtensionConfig {
    const sanitized: ExtensionConfig = {};
    sanitized.uri = this.sanitizeUri(userConfig?.uri) ?? this.buildUri;
    return sanitized as SanitizedExtensionConfig;
  }

  private sanitizeUri(uri?: Uri | string): Uri | undefined {
    if (uri && typeof uri === "string") {
      uri = new Uri(uri);
    }
    return uri as Uri | undefined;
  }
}