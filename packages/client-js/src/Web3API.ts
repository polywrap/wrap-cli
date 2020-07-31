import {
  Ethereum,
  IPFS
} from "./portals";
import { Manifest } from "./Manifest";
import { DocumentNode } from "graphql/language";
import { buildSchema, GraphQLSchema, execute } from "graphql";
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

  // Web3 API IPFS CID
  private _cid: string | undefined;

  // Web3 API Manifest
  private _manifest: Manifest | undefined;

  // Web3 API Schema
  private _schema: GraphQLSchema | undefined;

  constructor(private _config: IWeb3APIConfig) {
    // Sanitize API URI
    this.setUri(this._config.uri);
  }

  public setUri(uri: string) {
    if (!IPFS.isCID(uri) && !Ethereum.isENSDomain(uri)) {
      throw Error(`The Web3API URI provided is neither a ENS domain or an IPFS multihash: ${uri}`);
    }

    this._config.uri = uri;
    this._cid = undefined;
    this._manifest = undefined;
    this._schema = undefined;
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

  public async fetchCID(): Promise<string> {
    if (this._cid) {
      return this._cid;
    }

    const { uri, portals } = this._config;

    if (Ethereum.isENSDomain(uri)) {
      this._cid = await portals.ethereum.ensToCID(uri);
    } else {
      this._cid = uri;
    }

    return this._cid;
  }

  private async fetchAPIManifest(): Promise<Manifest> {
    if (this._manifest) {
      return this._manifest;
    }

    const { portals } = this._config;
    const cid = await this.fetchCID();

    // Fetch the API directory from IPFS
    const apiDirectory = await portals.ipfs.ls(cid);

    for await (const file of apiDirectory) {
      const { name, depth, type, path } = file;

      if (depth === 1 && type === "file" &&
         (name === "web3api.yaml" || name === "web3apy.yml")) {
        const manifestStr = portals.ipfs.catToString(path);
        this._manifest = YAML.safeLoad(manifestStr) as Manifest | undefined;

        if (this._manifest === undefined) {
          throw Error(`Unable to parse web3api.yaml\n${manifestStr}`);
        }

        return this._manifest;
      }
    }

    throw Error(`Unable to find web3api.yaml at ${cid}`);
  }

  public async fetchSchema(): Promise<GraphQLSchema> {
    if (this._schema) {
      return this._schema;
    }

    const { portals } = this._config;

    // Get the API's manifest
    const manifest = await this.fetchAPIManifest();

    // Get the API's schema
    const schemaStr = await portals.ipfs.catToString(
      `${this._cid}/${manifest.schema.file}`
    );

    // Convert schema into GraphQL Schema object
    this._schema = buildSchema(schemaStr);

    // If there's no Query type, add it to avoid execution errors
    if (!this._schema.getQueryType()) {
      const schemaStrWithQuery = schemaStr + `type Query { dummy: String }`;
      this._schema = buildSchema(schemaStrWithQuery);
    }

    const mutationType = this._schema.getMutationType();
    const queryType = this._schema.getQueryType();
    const entityTypes = this._schema.getTypeMap();

    // Wrap all queries & mutations w/ a proxy that
    // loads the module and executes the call

    return this._schema;
  }

  // Prefetch the API resources
  public async prefetch(): Promise<void> {
    await this.fetchSchema();
  }

  public async query(query: DocumentNode, variables?: { [name: string]: any }) {
    const { portals } = this._config;

    if (query.definitions.length > 1) {
      throw Error("Multiple async queries is not supported at this time.");
    }

    if (query.definitions.length === 0) {
      throw Error("Empty query.");
    }

    const def = query.definitions[0];

    if (def.kind === "SchemaDefinition" ||
        def.kind === "ObjectTypeDefinition") {
      // If an entity is being queried, send to a subgraph
      return await portals.graph.query(queryDef);
    } else if (def.kind === "OperationDefinition") {
      // else, execute query against schema
      const schema = await this.fetchSchema();

      const result = execute({
        schema,
        document: query,
        contextValue: context,
        variableValues: variables
      });
    }

    // TODO: e2e tests where we test
    // - subgraph queries
    // - mutation queries
    // - query queries
    // - all WASM integrations (IPFS, ETH, The Graph)
  }
}
