# @polywrap/test-env-js

Provides functions to setup a test environment with Polywrap CLI and Docker.

# Description

It allows user to initiate the test environment through a javascript function (it's the `infra` command in the CLI). It also exports the providers and ens addresses expected in the deployments (They are hard coded, because the initiation of the environment is deterministic)

# Usage

Initialization with the simple-storage wrapper.

``` typescript
import path from "path";
import { PolywrapClient } from "@polywrap/client-js";
import {
  buildWrapper,
  initTestEnvironment,
  stopTestEnvironment,
  providers,
  ensAddresses
} from "@polywrap/test-env-js";
import * as App from "../types/wrap";

// test wrapper in a test environment
export async function foo({
  // spin up docker containers for Ganache and IPFS.
  await initTestEnvironment();
  const CONNECTION = { networkNameOrChainId: "testnet" };

  // get path to the wrapper in testing
  const wrapperPath: string = path.join(path.resolve(__dirname), "..");

  // build current wrapper with CLI
  await buildWrapper(wrapperPath);

  // get URI to the local wrapper build
  const wrapperUri = `fs/${wrapperPath}/build`;

  // invoke the wrapper to deploy a contract to the test env
  const deployContractResponse = await App.SimpleStorage_Module.deployContract(
    { connection: CONNECTION },
    client,
    wrapperUri
  );
  const contractAddress = deployContractResponse.data as string;

  // invoke the wrapper to query a contract in the test env
  const response = await App.SimpleStorage_Module.getData(
    {
      address: contractAddr,
      connection: CONNECTION,
    },
    client,
    wrapperUri
  );
});

```

# API Outline

- ensAddresses, providers - constant addresses and urls
- runCLI - run arbitrary Polywrap CLI commands
- initTestEnvironment - spin up Ganache and IPFS Docker instances
- stopTestEnvironment - stop Docker
- buildWrapper - compile wasm and bindings
- buildAndDeployWrapper - deploy wrapper to the testnet ENS

## Constants

### providers

```typescript
/** The URIs for the default providers used by the default infrastructure module. */
export const providers = {
  ipfs: "http://localhost:5001",
  ethereum: "http://localhost:8545",
  http: "http://localhost:3500",
};
```

### ensAddresses

```typescript
/** The Ethereum addresses of the default infrastructure module's locally-deployed ENS smart contracts. */
export const ensAddresses = {
  ensAddress: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",
  resolverAddress: "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24",
  registrarAddress: "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb",
  reverseAddress: "0xe982E462b094850F12AF94d21D470e21bE9D0E9C",
} as const;
```

### embeddedWrappers

```typescript
/** Wasm wrappers embedded in the package */
export const embeddedWrappers = {
  ens: `wrap://fs/${path.join(__dirname, "wrappers", "ens")}`,
  uts46: `wrap://fs/${path.join(__dirname, "wrappers", "uts46")}`,
  sha3: `wrap://fs/${path.join(__dirname, "wrappers", "sha3")}`,
};
```

## Methods

### initTestEnvironment

```typescript
/**
 * Starts a local test environment using the default infrastructure module.
 *
 * @param cli? - a path to a Polywrap CLI binary.
 */
export const initTestEnvironment = async (
  cli?: string
): Promise<void> 
```

### stopTestEnvironment

```typescript
/**
 * Stops the local test environment (default infrastructure module) if one is running.
 *
 * @param cli? - a path to a Polywrap CLI binary.
 */
export const stopTestEnvironment = async (
  cli?: string
): Promise<void> 
```

### buildWrapper

```typescript
/**
 * Build the wrapper located at the given path
 *
 * @param wrapperAbsPath - absolute path of wrapper to build
 * @param manifestPathOverride? - path to p
 */
export async function buildWrapper(
  wrapperAbsPath: string,
  manifestPathOverride?: string
): Promise<void> 
```

### buildAndDeployWrapper

```typescript
/**
 * Build the wrapper located at the given path, and then deploy it to IPFS and ENS.
 * If an ENS domain is not provided, a randomly selected human-readable ENS domain name is used.
 *
 * @param wrapperAbsPath - absolute path of wrapper to build
 * @param ipfsProvider - ipfs provider to use for deployment
 * @param ethereumProvider - ethereum provider to use for ENS registration
 * @param ensName? - an ENS domain name to register and assign to the wrapper
 *
 * @returns registered ens domain name and IPFS hash
 */
export async function buildAndDeployWrapper({
  wrapperAbsPath,
  ipfsProvider,
  ethereumProvider,
  ensName,
}: {
  wrapperAbsPath: string;
  ipfsProvider: string;
  ethereumProvider: string;
  ensName?: string;
}): Promise<{
  ensDomain: string;
  ipfsCid: string;
}> 
```

```typescript title="Example: buildAndDeployWrapper with default infrastructure module"
import { buildAndDeployWrapper, providers } from "@polywrap/test-env-js";

const { ensDomain, ipfsCid } = await buildAndDeployWrapper({
  wrapperAbsPath: "...",
  ipfsProvider: providers.ipfs,
  ethereumProvider: providers.ethereum,
});
const ensUri = `ens/testnet/${ensDomain}`;
```

### buildAndDeployWrapperToHttp

```typescript
/**
 * Build the wrapper located at the given path, and then deploy it to HTTP.
 * If a domain name is not provided, a randomly selected human-readable domain name is used.
 *
 * @param wrapperAbsPath - absolute path of wrapper to build
 * @param httpProvider - http provider used for deployment and domain registration
 * @param name? - a domain name to register and assign to the wrapper
 *
 * @returns http uri
 */
export async function buildAndDeployWrapperToHttp({
  wrapperAbsPath,
  httpProvider,
  name,
}: {
  wrapperAbsPath: string;
  httpProvider: string;
  name?: string;
}): Promise<{ uri: string }> 
```

### runCLI

```typescript
/**
 * Runs the polywrap CLI programmatically.
 *
 * @param args - an array of command line arguments
 * @param cwd? - a current working directory
 * @param cli? - a path to a Polywrap CLI binary
 * @param env? - a map of environmental variables
 *
 * @returns exit code, standard output, and standard error logs
 */
export const runCLI = async (options: {
  args: string[];
  cwd?: string;
  cli?: string;
  env?: Record<string, string>;
}): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> 
```

```typescript title="Example: runCLI calling the 'infra' command"
const { exitCode, stderr, stdout } = await runCLI({
  args: ["infra", "up", "--modules=eth-ens-ipfs", "--verbose"]
});
```