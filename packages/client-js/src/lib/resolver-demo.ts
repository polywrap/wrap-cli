import { Query, QueryResult } from "./types";


/**
 * Generic interface of a Web3API.
 * All Web3API's whether they be WASM or JS must conform to this.
 */
export interface Web3API {
    query(query: Query): Promise<QueryResult>;
}


/**
 * Represents an instance of a WASM Web3API.
 */
export class WASMWeb3API implements Web3API {
    _module: ArrayBuffer;

    constructor(module: ArrayBuffer) {
    }

    async query(query: Query): Promise<QueryResult> {
        return undefined;
    }
}



/**
 * Represents the definition of a Web3API and allows for an instance of it to be created.
 */
export interface Web3APIDefinition {
    name: string;
    create: () => Promise<Web3API>;
}


/**
 * Instance of a WASM Web3API Definition.
 */
export class WASMWeb3APIDefinition implements Web3APIDefinition {
    // Cache of the module, downloaded on first 
    _module: ArrayBuffer | undefined = undefined;

    constructor(public name: string) {}

    /**
     * Creates an instance of the WASM Web 3 API.
     */
    public async create(): Promise<Web3API> {
        await this.preFetch();
        return new WASMWeb3API(this._module);
    }

    /**
     * Pre-fetches the WASM Module from IPFS if it hasn't already been fetched.
     */
    public async preFetch(): Promise<void> {
        if (this._module === undefined) {
            await this.downloadModuleFromIPFS();
        }
    }

    private async downloadModuleFromIPFS(): Promise<void> {
        // @TODO: Download the module from IPFS
        this._module = new ArrayBuffer(32);
    }
}


/**
 * Represents an instance of a JS Web3API Definition.
 */
export class JSWeb3APIDefinition<T extends Web3API> implements Web3APIDefinition {
    public name: string;
    private _factory: () => T | undefined;
    
    /**
     * Creates a definition of a JS Web3API.
     * If just the class is given, the class will be created with no parameters.
     * Optionally a factory can be specified.
     * @param _class The class of the JS Web3API
     * @param factory Optional factory method of creation.
     */
    constructor(private _class: new (...args: any[]) => T, factory?: () => T) {
        this._factory = factory;
        this.name = _class.name;
    }

    /**
     * Creates an instance of the JS Class which is the JS Web3API.
     */
    public async create(): Promise<T> {
        if (this._factory !== undefined) {
            return this._factory();
        }

        return new this._class();
    }
}

/**
 * A Web 3 API Module Resolver will attempt to resolve a given URI into a Web3APIDefinition.
 * If the resolution fails, then undefined returns.
 */
export type Web3APIModuleResolver = (uri: string) => Promise<Web3APIDefinition | undefined>;


/**
 * Resolves a Web3API via IPFS.
 * @param uri The Web3API URI to resolve.
 */
export const IPFSResolver: Web3APIModuleResolver = async (uri: string) => {
    // @TODO: Look up to see if uri resolves to Web3API in IPFS

    // ----------------------- Test Code ---------------------------------
    // the 'alpha.module1.eth' is 'available' in IPFS
    if (uri === "alpha.module1.eth") {
        return new WASMWeb3APIDefinition(uri);
    }
    // modules that start with 'cat.house.' are 'available' in IPFS
    if (/^cat\.house\..*$/g.test(uri)) {
        return new WASMWeb3APIDefinition(uri);
    }
    // ---------------------- End Test Code ---------------------------------

    // Could not find in IPFS
    return undefined;
}

// Helper to match a uri to a pattern (* wildcards only)
function uriMatchesPattern(uri: string, pattern: string): boolean {
    pattern = pattern.replace(/\./g, '\.');
    const patternMatcher = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return patternMatcher.test(uri);
}

/**
 * Wraps a resolver with a pattern matching resolver.
 * The wrapped resolver will only be used if the uri matches the pattern.
 * @param pattern The uri pattern to match against.
 * @param resolver The resolver to use if the URI matches the pattern.
 */
export function createPatternResolver(pattern: string, resolver: Web3APIModuleResolver): Web3APIModuleResolver {
    return async (uri: string) => {

        if (uriMatchesPattern(uri, pattern)) {
            return await resolver(uri);
        }

        return undefined;
    }
}

/**
 * Resolves a URI to a Web3APIModuleDefinition
 * @param uri The URI to resolve
 * @param resolvers An array of resolvers, ordered in resolution order.
 */
export async function resolveURI(uri: string, resolvers: Web3APIModuleResolver[]): Promise<Web3APIDefinition> {
    for (let resolver of resolvers) {
        const module: Web3APIDefinition | undefined = await resolver(uri);
        if (module !== undefined) {
            return module;
        }
    }

    return undefined;
    // throw new Error(`Unable to resolve "${uri}"`);
}





/* ------------------ Test Code ------------------------ */


// Sample JS Web3API's
// These could be things like the Ethereum client
// Or mocking out a WASM Web3API

// This one takes no parameters
class DogHouseBowlJSOverride implements Web3API {
    constructor() {
    }

    public query(query: Query): Promise<QueryResult> {
        return undefined;
    }
}

// This one takes a parameter in the constructor
class MyJSModule implements Web3API {
    constructor(public a: string) {

    }
    public query(query: Query): Promise<QueryResult> {
        return undefined;
    }
}


// Setup our list of URI Resolvers
// This is what will be fed to the Web3API Client, but these tests just tests the resolution
// The order of these is important, the first ones will get used first
const testResolvers = [
    // the `createPatternResolver` helper will match the given pattern, if it's a hit then it will resolve with the provided function

    // myModule.eth will result in a JS Web3API being created
    createPatternResolver("myModule.eth", async () => {
        return new JSWeb3APIDefinition(MyJSModule,
            () => {
                // Since MyJSModule requires a parameter, we have to use a factory method
                return new MyJSModule("test");
            });
    }),
    
    // dog.house.bowl.eth will result in a JS Web3API Module too
    createPatternResolver("dog.house.bowl.eth", async () => {
        return new JSWeb3APIDefinition(DogHouseBowlJSOverride);
    }),

    // This pattern has a wildcard and will match any uri that starts with 'dog.house.'
    createPatternResolver("dog.house.*", async (uri: string) => {
        // Any instance of 'dog' in the uri will be replace with 'cat'
        // Then we use the IPFS resolver to look up the module
        //  This shows how you can actually wrap/chain resolvers together
        return IPFSResolver(uri.replace("dog", "cat"));
    }),

    // By default anything that we haven't already resolved will be resolved with the IPFS resolver
    IPFSResolver
];


interface URITests {
    [key: string]: string | undefined
}

// The name of a Web3API depends on if it's WASM or JS:
//      When it's a WASM Web3API, the "name" is the uri
//      When it's a JS Web3API, the "name" is the JavaScript class

// These are [input URI] -> [expected URI] mappings
// undefined means that it fails to resolve
const URIsToTest: URITests = {
    "myModule.eth": "MyJSModule",
    "dog.house.package.eth": "cat.house.package.eth",
    "cat.house.package.v2.eth": "cat.house.package.v2.eth",
    "alpha.module1.eth": "alpha.module1.eth",
    "myModule": undefined,
    "cat.dog.eth": undefined,
    "dog.house.bowl.eth": "DogHouseBowlJSOverride",
}

async function runTest(): Promise<void> {
    for (let [uri, expected] of Object.entries(URIsToTest)) {
        const actual = await resolveURI(uri, testResolvers);

        // Actual is a Web3APIDefinition, which can be used to instantiate the Web3API.
        // It could also be cached (especially for the WASM modules) since a definition can be used multiple times to create multiple unique instances of the Web3API

        // See if test passes and log to console (yes i should use junit or something)
        expected = expected === undefined ? "unresolved" : expected;
        const actualName = actual === undefined ? "unresolved" : actual.name;
        const good = actualName === expected;
        const message = `${good ? "PASS" : "FAIL"}    ` + uri.padEnd(25) + ' => ' + actualName.padEnd(25) + `[expected ${expected}]`;
        console.log(message);
    }
}

runTest();
