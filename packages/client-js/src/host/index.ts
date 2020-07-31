import { getIpfsImports } from "./ipfs";
import { IPortals } from "../Web3API";
import { ASCModule, ASCImports } from "../types";

export function getHostImports(getModule: () => ASCModule, portals: IPortals): ASCImports {
  const imports: ASCImports = { };

  if (portals.ipfs) {
    imports["ipfs"] = { ...getIpfsImports(getModule, portals.ipfs) };
  }

  return imports;
}
