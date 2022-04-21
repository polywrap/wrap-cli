import { ConnectionConfigs } from "./Connection";

export interface EthereumConfig {
  networks: ConnectionConfigs;
  defaultNetwork?: string;
}
