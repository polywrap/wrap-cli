export interface Network {
  name?: string;
  chainId?: number;
}

export interface Connection {
  node?: string;
  network?: Network;
}
