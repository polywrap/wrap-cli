import { Ethereum, IPFS } from "../portals";
import { ClientModule, Manifest, Web3API, Web3APIDefinition } from "./types";
import YAML from "js-yaml";
import { WASMWeb3API } from "./wasmWeb3Api";

interface Web3APIWASMModules {
    query: Maybe<ArrayBuffer>;
    mutate: Maybe<ArrayBuffer>;
}

/**
 * Instance of a WASM Web3API Definition.
 * @TODO: Refactor actual resolution of ENS/IPFS into the resolver
 *  ie: No ethereum or IPFS code smell in this class
 */
export class WASMWeb3APIDefinition implements Web3APIDefinition {
    // Cache of the module, downloaded on first 
    _module: Maybe<Web3APIWASMModules>;
    _cid: Maybe<string>;
    _manifest: Maybe<Manifest>;
    _schema: Maybe<string>;

    constructor(public uri: string) {
        if (!IPFS.isCID(uri) && !Ethereum.isENSDomain(uri)) {
            throw Error(`'${uri}' is neither an ENS domain or an IPFS multihash`);
        }
    }

    /**
     * Creates an instance of the WASM Web 3 API.
     */
    public async create(): Promise<Web3API> {
        await this.preFetch();
        if (!this._module || !this._cid || !this._manifest || !this._schema) {
            throw Error(`Unable to create WASM Web3API Definition ${this.uri}`);
        }

        return new WASMWeb3API({
            uri: this.uri,
            cid: this._cid,
            manifest: this._manifest,
            rawSchema: this._schema,
            mutateModule: this._module.mutate,
            queryModule: this._module.query
        });
    }

    /**
     * Pre-fetches the WASM Module from IPFS if it hasn't already been fetched.
     */
    public async preFetch(): Promise<void> {
        if (!this._module) {
            await this.fetchModules();
        }
        if (!this._cid) {
            await this.fetchCID();
        }
        if (!this._schema) {
            await this.fetchSchema();
        }
        if (!this._manifest) {
            await this.fetchManifest();
        }
    }

    private async fetchModules(): Promise<Web3APIWASMModules> {
        if (this._module) {
            return this._module
        }

        const ipfs = this.getIPFSClient();
        const cid = await this.fetchCID();
        const manifest = await this.fetchManifest();
        
        const _getModule = async (module: ClientModule | undefined): Promise<Maybe<ArrayBuffer>> => {
            if (module === undefined) {
                return null;
            }
            const file = module.module.file
            return await ipfs.catToBuffer(`${cid}/${file}`);
        }
        
        this._module = {
            mutate: await _getModule(manifest.mutation),
            query: await _getModule(manifest.query)
        }

        return this._module;
    }

    private async fetchCID(): Promise<string> {
        if (this._cid) {
            return this._cid;
        }

        if (Ethereum.isENSDomain(this.uri)) {
            const client = this.getEthereumClient();
            this._cid = await client.ensToCID(this.uri);
        } else {
            this._cid = this.uri;
        }

        return this._cid;
    }

    private async fetchManifest(): Promise<Manifest> {
        if (this._manifest) {
            return this._manifest;
        }

        const cid = await this.fetchCID();
        const ipfs = this.getIPFSClient();

        const apiContents = await ipfs.ls(cid);

        for await (const file of apiContents) {
            const { name, depth, type, path } = file;
      
            if (depth === 1 && type === "file" &&
               (name === "web3api.yaml" || name === "web3apy.yml")) {
              const manifestStr = await ipfs.catToString(path);
              this._manifest = YAML.safeLoad(manifestStr) as Manifest | null;
      
              if (!this._manifest) {
                throw Error(`Unable to parse web3api.yaml\n${manifestStr}`);
              }
      
              return this._manifest;
            }
        }

        // Kinda late to figure out if we can resolve it or not.
        // Might move this logic into the resolver to at least ensure we have
        // a manifest that we can resolve to before creating a definition
        throw Error(`Unable to resolve the Web3API ${this.uri}`);
    }

    private async fetchSchema(): Promise<string> {
        if (this._schema) {
            return this._schema;
        }

        const ipfs = this.getIPFSClient();

        let rawSchema = await ipfs.catToString(
            `${this._cid}/schema.graphql`
        );

        this._schema = rawSchema;
        return this._schema;
      }

    private getEthereumClient(): Ethereum {
        // @TODO: Use a real client
        return {} as Ethereum;
    }

    private getIPFSClient(): IPFS {
        // @TODO: Use a real client
        return {} as IPFS;
    }


}


/**
 * Represents an instance of a JS Web3API Definition.
 */
export class JSWeb3APIDefinition<T extends Web3API> implements Web3APIDefinition {
    public name: string;
    private _factory: Maybe<() => T>;
    
    /**
     * Creates a definition of a JS Web3API.
     * If just the class is given, the class will be created with no parameters.
     * Optionally a factory can be specified.
     * @param _class The class of the JS Web3API
     * @param factory Optional factory method of creation.
     */
    constructor(private _class: new (...args: any[]) => T, factory?: () => T) {
        if (factory) {
            this._factory = factory;
        }
        this.name = _class.name;
    }

    /**
     * Creates an instance of the JS Class which is the JS Web3API.
     */
    public async create(): Promise<T> {
        if (this._factory) {
            return this._factory();
        }

        return new this._class();
    }
}
