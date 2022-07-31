import { IpfsClient } from "./IpfsClient";

export const createIpfsClient: (
  ipfsProvider: string
) => IpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");
