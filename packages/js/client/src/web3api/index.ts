export * from "./PluginWeb3Api";
export * from "./WasmWeb3Api";

// TODO: logging (client.logLevel === Log.Info && log.logInfo("message..."))
// - logging used to verify call stacks of various client implementations
// TODO: support lazy fetching of files within Web3Api class

// TODO: client.sanitizeRedirects() -> iterate through all redirects, make sure we can resolve all of them (will call getImplementations...)
// TODO: client.getImplementations(uri) -> iterate through all known Web3API's and find all implementations
