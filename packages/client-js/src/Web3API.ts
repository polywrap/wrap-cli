import {
  Ethereum,
  IPFS,
  Subgraph
} from "./portals";
import { getHostImports } from "./host";
import { isPromise } from "./lib/async";
import {
  Query,
  QueryResult,
  Manifest,
  ModulePath
} from "./lib/types";
import { WasmWorker } from "./lib/wasm-worker";

import {
  buildSchema,
  execute,
  GraphQLSchema,
  GraphQLObjectType
} from "graphql";
import YAML from "js-yaml";
import { manifestValidation } from "./lib/validator";

export interface IPortals {
  ipfs: IPFS;
  ethereum: Ethereum;
  subgraph?: Subgraph;
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

  public async fetchAPIManifest(): Promise<Manifest> {
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
        const manifestStr = await portals.ipfs.catToString(path);
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
    // TODO: make this based on the manifest
    const schemaStr = await portals.ipfs.catToString(
      `${this._cid}/schema.graphql`
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

    // Wrap all queries & mutations w/ a proxy that
    // loads the module and executes the call
    if (mutationType) {
      if (!manifest.mutation) {
        throw Error("Malformed Manifest: Schema contains mutations but the manifest does not.");
      }

      this._addResolvers(
        manifest.mutation.module,
        mutationType
      );
    }

    if (queryType) {
      if (!manifest.query) {
        throw Error("Malformed Manifest: Schema contains queries but the manifest does not.");
      }

      this._addResolvers(
        manifest.query.module,
        queryType
      );
    }

    return this._schema;
  }

  // Prefetch the API resources
  public async prefetch(): Promise<void> {
    await this.fetchSchema();
  }

  public async query(query: Query): Promise<QueryResult> {
    const { portals } = this._config;
    const queryDoc = query.query;

    if (queryDoc.definitions.length > 1) {
      throw Error("Multiple async queries is not supported at this time.");
    }

    if (queryDoc.definitions.length === 0) {
      throw Error("Empty query.");
    }

    const def = queryDoc.definitions[0];

    if (def.kind === "OperationDefinition" && def.name) {
      // else, execute query against schema
      const schema = await this.fetchSchema();

      let res = execute({
        schema,
        document: queryDoc,
        variableValues: query.variables
      });

      if (isPromise(res)) {
        res = await res;
      }

      return res;
      // TODO: remove this hack when subgraph schema is supported
    } else /*if (
        def.kind === "SchemaDefinition" ||
        def.kind === "ObjectTypeDefinition") */{
      if (!portals.subgraph) {
        throw Error("No subgraph portal available.");
      }

      // TODO: handle this better :P
      const manifest = await this.fetchAPIManifest();

      if (!manifest.subgraph) {
        throw Error("The manifest is missing a subgraph");
      }

      // If an entity is being queried, send to a subgraph
      return await portals.subgraph.query(manifest.subgraph.id, query);
    } /*else {
      throw Error(`Unrecognized query definition kind: "${def.kind}"`);
    }*/
  }

  public static validateManifest(manifest: object) {
    manifestValidation(manifest);
  }

  private _addResolvers(module: ModulePath, schemaType: GraphQLObjectType<any, any>) {
    const fields = schemaType.getFields();
    const fieldNames = Object.keys(fields);

    for (const fieldName of fieldNames) {
      const outputType = fields[fieldName].type.toString().toLowerCase().replace('!', '');

      fields[fieldName].resolve = async (source, args, context, info) => {
        const { portals } = this._config;

        // Load the WASM source
        const wasm = await portals.ipfs.catToBuffer(
          `${this._cid}/${module.file}`
        );

        // Instantiate it
        const ww: WasmWorker = new WasmWorker(
          wasm,
          getHostImports(() => ww, portals)
        );

        // TODO: this is very incomplete and hacky, replace with
        //       proper heap manager.
        let mapped = []
        let toRelease = []

        // Marshall Types
        const toMarsh = Object.values(args);
        for (const marshMe of toMarsh) {
          let result;
          if (typeof marshMe === "string") {
            result = (await ww.writeStringAsync(marshMe)).result;
          } else {
            mapped.push(marshMe);
            continue;
          }
          mapped.push(result);
          toRelease.push(result);
        }

        // Execute the call
        const res = await ww.callAsync(fieldName, ...mapped)

        // TODO: validate return value against the schema
        let result: any = res.result;

        if (result) {
          if (outputType === "string") {
            result = (await ww.readStringAsync(result)).result;
          } else if (outputType === "boolean") {
            result = result === 1 ? true : false;
          } else if (outputType === "int") {
            if (typeof result === "string") {
              result = Number.parseInt(result);
            }
          } else {
            throw Error(`Unsupported return type: ${outputType}`);
          }
        }

        // TODO: have a pattern around reusing workers instead of spinning
        //       them up each time (measure how long that takes first)
        ww.destroy();

        return result;
      }
    }
  }
}
