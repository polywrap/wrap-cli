import { generateName } from "./generate-name";
import { build } from "./cli-api";
import { ensAddresses, runCLI } from "./index";

import fs from "fs";
import path from "path";
import yaml from "yaml";
import { Uri } from "@polywrap/core-js";
import {
  DeployManifest,
  deserializePolywrapManifest,
} from "@polywrap/polywrap-manifest-types-js";

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
}> {
  const manifestPath = `${wrapperAbsPath}/polywrap.yaml`;
  const tempManifestFilename = `polywrap-temp.yaml`;
  const tempDeployManifestFilename = `polywrap.deploy-temp.yaml`;
  const tempManifestPath = path.join(wrapperAbsPath, tempManifestFilename);
  const tempDeployManifestPath = path.join(
    wrapperAbsPath,
    tempDeployManifestFilename
  );

  // create a new ENS domain
  const wrapperEns = ensName ?? `${generateName()}.eth`;

  await build(wrapperAbsPath);

  // manually configure manifests
  const { __type, ...polywrapManifest } = deserializePolywrapManifest(
    fs.readFileSync(manifestPath, "utf-8")
  );

  fs.writeFileSync(
    tempManifestPath,
    yaml.stringify(
      {
        ...polywrapManifest,
        extensions: {
          ...polywrapManifest.extensions,
          deploy: `./${tempDeployManifestFilename}`,
        },
      },
      null,
      2
    )
  );

  const deployManifest: Omit<DeployManifest, "__type"> = {
    format: "0.2.0",
    jobs: {
      buildAndDeployWrapper: {
        config: {
          provider: ethereumProvider,
          ensRegistryAddress: ensAddresses.ensAddress,
          ensRegistrarAddress: ensAddresses.registrarAddress,
          ensResolverAddress: ensAddresses.resolverAddress,
        },
        steps: [
          {
            name: "registerName",
            package: "ens-recursive-name-register",
            uri: `wrap://ens/${wrapperEns}`,
          },
          {
            name: "ipfsDeploy",
            package: "ipfs",
            uri: `fs/${wrapperAbsPath}/build`,
            config: {
              gatewayUri: ipfsProvider,
            },
          },
          {
            name: "ensPublish",
            package: "ens",
            uri: "$$ipfsDeploy",
            config: {
              domainName: wrapperEns,
            },
          },
        ],
      },
    },
  };
  fs.writeFileSync(
    tempDeployManifestPath,
    yaml.stringify(deployManifest, null, 2)
  );

  // deploy Wrapper

  const {
    exitCode: deployExitCode,
    stdout: deployStdout,
    stderr: deployStderr,
  } = await runCLI({
    args: ["deploy", "--manifest-file", tempManifestPath],
  });

  if (deployExitCode !== 0) {
    console.error(`polywrap exited with code: ${deployExitCode}`);
    console.log(`stderr:\n${deployStderr}`);
    console.log(`stdout:\n${deployStdout}`);
    throw Error("polywrap CLI failed");
  }

  // remove manually configured manifests

  fs.unlinkSync(tempManifestPath);
  fs.unlinkSync(tempDeployManifestPath);

  // get the IPFS CID of the published package
  const extractCID = /(wrap:\/\/ipfs\/[A-Za-z0-9]+)/;
  const result = deployStdout.match(extractCID);

  if (!result) {
    throw Error(
      `polywrap CLI output missing IPFS CID.\nOutput: ${deployStdout}`
    );
  }

  const wrapperCid = new Uri(result[1]).path;

  return {
    ensDomain: wrapperEns,
    ipfsCid: wrapperCid,
  };
}

export async function buildAndDeployWrapperToHttp({
  wrapperAbsPath,
  httpProvider,
  name,
}: {
  wrapperAbsPath: string;
  httpProvider: string;
  name?: string;
}): Promise<{ uri: string }> {
  const manifestPath = `${wrapperAbsPath}/polywrap.yaml`;
  const tempManifestFilename = `polywrap-temp.yaml`;
  const tempDeployManifestFilename = `polywrap.deploy-temp.yaml`;
  const tempManifestPath = path.join(wrapperAbsPath, tempManifestFilename);
  const tempDeployManifestPath = path.join(
    wrapperAbsPath,
    tempDeployManifestFilename
  );

  const wrapperName = name ?? generateName();
  const postUrl = `${httpProvider}/wrappers/local/${wrapperName}`;

  await build(wrapperAbsPath);

  // manually configure manifests

  const { __type, ...polywrapManifest } = deserializePolywrapManifest(
    fs.readFileSync(manifestPath, "utf-8")
  );

  polywrapManifest.extensions = {
    ...polywrapManifest.extensions,
    deploy: `./${tempDeployManifestFilename}`,
  };
  fs.writeFileSync(
    tempManifestPath,
    yaml.stringify({ ...polywrapManifest }, null, 2)
  );

  const deployManifest: Omit<DeployManifest, "__type"> = {
    format: "0.2.0",
    jobs: {
      buildAndDeployWrapperToHttp: {
        steps: [
          {
            name: "httpDeploy",
            package: "http",
            uri: `fs/${wrapperAbsPath}/build`,
            config: {
              postUrl,
            },
          },
        ],
      },
    },
  };
  fs.writeFileSync(
    tempDeployManifestPath,
    yaml.stringify(deployManifest, null, 2)
  );

  // deploy Wrapper

  const {
    exitCode: deployExitCode,
    stdout: deployStdout,
    stderr: deployStderr,
  } = await runCLI({
    args: ["deploy", "--manifest-file", tempManifestPath],
  });

  if (deployExitCode !== 0) {
    console.error(`polywrap exited with code: ${deployExitCode}`);
    console.log(`stderr:\n${deployStderr}`);
    console.log(`stdout:\n${deployStdout}`);
    throw Error("polywrap CLI failed");
  }

  // remove manually configured manifests

  fs.unlinkSync(tempManifestPath);
  fs.unlinkSync(tempDeployManifestPath);

  return {
    uri: postUrl,
  };
}
