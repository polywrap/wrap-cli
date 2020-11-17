import { Web3APIModuleResolver } from ".";
import { Ethereum, IPFS } from "../../portals";
import { WASMWeb3APIDefinition } from "../definitions";
import { ClientModule, Manifest } from "../types";
import YAML from "js-yaml";

export const IPFSResolver = (eth: Ethereum, ipfs: IPFS): Web3APIModuleResolver => {
  const getManifest = async (cid: string) => {
    let manifest: Manifest | undefined;
    const apiContents = await ipfs.ls(cid);
    
    for await (const file of apiContents) {
      const { name, depth, type, path } = file;

      if (depth === 1 && type === "file" &&
         (name === "web3api.yaml" || name === "web3apy.yml")) {
        const manifestStr = await ipfs.catToString(path);
        manifest = YAML.safeLoad(manifestStr) as Manifest;
        return manifest;
      }
    }

    return undefined;
  }

  const getSchema = async (cid: string) => {
    return await ipfs.catToString(
      `${cid}/schema.graphql`
    );
  }

  const getModules = async (cid: string, manifest: Manifest) => {
    const _getModule = async (module: Maybe<ClientModule>): Promise<Maybe<ArrayBuffer>> => {
      if (!module) {
          return null;
      }
      const file = module.module.file
      return await ipfs.catToBuffer(`${cid}/${file}`);
    }
    
    return {
        mutate: await _getModule(manifest.mutation),
        query: await _getModule(manifest.query)
    }
  }


  return async (uri: string) => {
    let cid: string = uri;

    if (Ethereum.isENSDomain(uri)) {
      cid = await eth.ensToCID(uri);
    }

    if (!IPFS.isCID(cid)) {
      return null;
    }

    let manifest: Maybe<Manifest> = await getManifest(cid);
    if (!manifest) {
      return null;
    }

    let schema = await getSchema(cid);
    let modules = await getModules(cid, manifest);

    return new WASMWeb3APIDefinition({
      uri,
      cid,
      module: modules,
      manifest,
      schema
    });
  }
}
