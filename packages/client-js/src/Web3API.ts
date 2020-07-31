import {
  Ethereum,
  IPFS
} from "./portals";
import { Manifest } from "./Manifest";
import { DocumentNode } from "graphql/language";
import { buildSchema } from "graphql";
import YAML from "js-yaml";

interface IPortals {
  ipfs: IPFS;
  ethereum: Ethereum;
}

export interface IWeb3APIConfig {
  uri: string;
  portals: IPortals;
}

export class Web3API {
  constructor(private _config: IWeb3APIConfig) {
    // Sanitize API URI
    this.setUri(this._config.uri);
  }

  public setUri(uri: string) {
    if (!IPFS.isCID(uri) && !Ethereum.isENSDomain(uri)) {
      throw Error(`The Web3API URI provided is neither a ENS domain or an IPFS multihash: ${uri}`);
    }

    this._config.uri = uri;
  }

  public getPortal<T extends keyof IPortals>(
    name: T
  ) {
    return this._config.portals[name];
  }

  public setPortal<T extends keyof IPortals>(
    name: T, portal: IPortals[T]
  ) {
    this._config.portals[name] = portal;
  }

  public async query(query: DocumentNode, variables?: { [name: string]: any }) {
    const { uri, portals } = this._config;

    // Get the API's CID
    let cid;

    if (Ethereum.isENSDomain(uri)) {
      cid = await portals.ethereum.ensToCID(uri);
    } else {
      cid = uri;
    }

    // Get the API's manifest
    const manifestYaml = await this._getAPIManifest(cid);

    if (manifestYaml === undefined) {
      throw Error(`Unable to find web3api.yaml at ${cid}`);
    }

    const manifest = YAML.safeLoad(manifestYaml) as Manifest | undefined;

    if (manifest === undefined) {
      throw Error(`Unable to load web3api.yaml\n${manifest}`);
    }

    // Get the API's schema
    const schemaStr = await portals.ipfs.catToString(
      `${cid}/${manifest.schema.file}`
    );

    // Convert schema into GraphQL Schema object
    let schema = buildSchema(schemaStr);

    // If there's no Query type, add it to avoid execution errors
    if (!schema.getQueryType()) {
      const schemaStrWithQuery = schemaStr + `type Query { dummy: String }`;
      schema = buildSchema(schemaStrWithQuery);
    }

    const mutationType = schema.getMutationType();
    const queryType = schema.getQueryType();
    const entityTypes = schema.getTypeMap();

    // Wrap all queries & mutations w/ a proxy that
    // loads the module and executes the call

    // If an entity is being queried, send to a subgraph

    // else, execute query against schema

    // TODO: e2e tests where we test
    // - subgraph queries
    // - mutation queries
    // - query queries
    // - all WASM integrations (IPFS, ETH, The Graph)
  }

  private async _getAPIManifest(cid: string): Promise<string | undefined> {
    const { portals } = this._config;

    // Fetch the API directory from IPFS
    const apiDirectory = await portals.ipfs.ls(cid);

    for await (const file of apiDirectory) {
      const { name, depth, type, path } = file;

      if (depth === 1 && type === "file" &&
         (name === "web3api.yaml" || name === "web3apy.yml")) {
        return portals.ipfs.catToString(path);
      }
    }

    return undefined;
  }
}
