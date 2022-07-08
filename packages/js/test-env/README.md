# Polywrap Test Env (@polywrap/test-env-js)

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

# API

- ensAddresses, providers - constant addresses and urls
- runCLI - run arbitrary Polywrap CLI commands
- initTestEnvironment - spin up Ganache and IPFS Docker instances 
- stopTestEnvironment - stop Docker
- buildWrapper - compile wasm and bindings
- buildAndDeployWrapper - deploy wrapper to the testnet ENS
