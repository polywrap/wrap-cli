"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wallet_1 = require("@ethersproject/wallet");
var providers_1 = require("@ethersproject/providers");
var core_js_1 = require("@web3api/core-js");
var client_js_1 = require("@web3api/client-js");
var path_1 = __importDefault(require("path"));
var ethereum_plugin_js_1 = require("@web3api/ethereum-plugin-js");
var contentHash = require("content-hash");
var ENSPublisher = /** @class */ (function () {
    function ENSPublisher() {
    }
    ENSPublisher.prototype.execute = function (uri, config) {
        return __awaiter(this, void 0, void 0, function () {
            var cid, connectionProvider, _a, chainIdNum, networkName, network, signer, ethereumPluginUri, ensWrapperUri, client, resolver, hash, setContenthashData;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (uri.authority !== "ipfs") {
                            throw new Error("ENS Deployer: resolved URI from " + uri + " does not represent an IPFS contentHash");
                        }
                        cid = uri.path;
                        connectionProvider = new providers_1.JsonRpcProvider(config.provider);
                        return [4 /*yield*/, connectionProvider.getNetwork()];
                    case 1:
                        _a = _c.sent(), chainIdNum = _a.chainId, networkName = _a.name;
                        network = chainIdNum === 1337 ? "testnet" : networkName;
                        signer = config.privateKey
                            ? new wallet_1.Wallet(config.privateKey).connect(connectionProvider)
                            : undefined;
                        ethereumPluginUri = "w3://ens/ethereum.web3api.eth";
                        ensWrapperUri = "fs/" + path_1.default.join(path_1.default.dirname(require.resolve("@web3api/test-env-js")), "wrappers", "ens");
                        client = new client_js_1.Web3ApiClient({
                            plugins: [
                                {
                                    uri: ethereumPluginUri,
                                    plugin: ethereum_plugin_js_1.ethereumPlugin({
                                        networks: (_b = {},
                                            _b[network] = {
                                                provider: config.provider,
                                                signer: signer,
                                            },
                                            _b),
                                        defaultNetwork: network,
                                    }),
                                },
                            ],
                        });
                        return [4 /*yield*/, client.invoke({
                                method: "getResolver",
                                uri: ensWrapperUri,
                                input: {
                                    registryAddress: config.ensRegistryAddress,
                                    domain: config.domainName,
                                    connection: {
                                        networkNameOrChainId: network,
                                    },
                                },
                            })];
                    case 2:
                        resolver = (_c.sent()).data;
                        if (!resolver) {
                            throw new Error("Could not get resolver for '" + config.domainName + "'");
                        }
                        if (resolver === "0x0000000000000000000000000000000000000000") {
                            throw new Error("Resolver not set for '" + config.domainName + "'");
                        }
                        hash = "0x" + contentHash.fromIpfs(cid);
                        return [4 /*yield*/, client.invoke({
                                method: "setContentHash",
                                uri: ensWrapperUri,
                                input: {
                                    domain: config.domainName,
                                    cid: hash,
                                    resolverAddress: resolver,
                                    connection: {
                                        networkNameOrChainId: network,
                                    },
                                },
                            })];
                    case 3:
                        setContenthashData = (_c.sent()).data;
                        if (!setContenthashData) {
                            throw new Error("Could not set contentHash for '" + config.domainName + "'");
                        }
                        return [4 /*yield*/, client.invoke({
                                method: "awaitTransaction",
                                uri: ethereumPluginUri,
                                input: {
                                    txHash: setContenthashData.hash,
                                    confirmations: 1,
                                    timeout: 15000,
                                    connection: {
                                        networkNameOrChainId: network,
                                    },
                                },
                            })];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, new core_js_1.Uri("ens/" + config.domainName)];
                }
            });
        });
    };
    return ENSPublisher;
}());
exports.default = new ENSPublisher();
//# sourceMappingURL=index.js.map