/* eslint-disable prefer-const */
import {
  intlMsg,
  defaultBuildPath,
  Web3ApiProject,
  defaultWeb3ApiManifest,
  resolvePathIfExists,
} from "../lib";
import { Deployer, Publisher, PublishHandler } from "../lib/deploy/DeploymentManager";
import { convertDirectoryToEntry } from "../lib/deploy/file";

import chalk from "chalk";
import fs from "fs";
import path from "path";
import { GluegunToolbox, GluegunPrint } from "gluegun";

const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");
const defaultOutputDirectory = defaultBuildPath;
const optionsStr = intlMsg.commands_deploy_options_options();
const pathStr = intlMsg.commands_deploy_options_o_path();

const HELP = `
${chalk.bold("w3 deploy")} [${optionsStr}]

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                         ${intlMsg.commands_deploy_options_h()}
  -m, --manifest-file <${pathStr}>         ${intlMsg.commands_deploy_options_m({
  default: defaultManifestStr,
})}
  -v, --verbose                      ${intlMsg.commands_deploy_options_v()}
  -p, --path [<${pathStr}>]"                ${intlMsg.commands_deploy_options_p()}
`;

export default {
  alias: ["b"],
  description: intlMsg.commands_build_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    const { h, p, m, v, n, c } = parameters.options;
    let { help, path, manifestFile, verbose, name, cid } = parameters.options;

    help = help || h;
    path = path || p;
    verbose = verbose || v;
    manifestFile = manifestFile || m;
    name = name || n;
    cid = cid || c;

    // Validate Params
    const paramsValid = validateDeployParams(print, {
      name,
      cid,
      path,
      manifestFile,
    });

    if (help || !paramsValid) {
      print.info(HELP);
      if (!paramsValid) {
        process.exitCode = 1;
      }
      return;
    }

    // Resolve manifest & output directory
    const manifestPaths = manifestFile
      ? [manifestFile as string]
      : defaultWeb3ApiManifest;
    manifestFile = resolvePathIfExists(filesystem, manifestPaths);

    if (!manifestFile) {
      print.error(
        intlMsg.commands_build_error_manifestNotFound({
          paths: manifestPaths.join(", "),
        })
      );
      return;
    }

    const buildPath: string = path ?? defaultOutputDirectory;

    const project = new Web3ApiProject({
      rootCacheDir: path.dirname(manifestFile),
      web3apiManifestPath: manifestFile,
      quiet: verbose ? false : true,
    });

    await project.validate();

    const deployManifest = await project.getDeployManifest();

    if (!deployManifest) {
      throw new Error("No deploy manifest");
    }

    const packages = {
      deploy: deployManifest.deploy
        ? Object.values(deployManifest.deploy).map((d) => d.package)
        : [],
      publish: deployManifest.publish
        ? Object.values(deployManifest.publish).map((p) => p.package)
        : [],
    };

    sanitizePackages(packages);

    await project.cacheDeploymentPackages(packages);

    const deployments: Record<string, string> = {};

    // Deploy steps don't depend on anything. Execute them all
    if (deployManifest.deploy) {
      const buildDirEntry = convertDirectoryToEntry(buildPath);

      for await (const key of Object.keys(deployManifest.deploy)) {
        const deployer = getDeployer(key);

        const uri = await deployer.deploy({
          files: [],
          directories: [buildDirEntry],
        });

        deployments[key] = uri;
      }

      console.log(deployments);
    }

    if (deployManifest.publish) {
      const handlers: Record<string, PublishHandler> = {};
      const roots: { handler: PublishHandler; uri: string }[] = [];

      // Create all handlers
      Object.entries(deployManifest.publish).forEach(([key, value]) => {
        const publisher = getPublisher(value.package);
        const handler = new PublishHandler(publisher, value.config);

        handlers[key] = handler;
      });

      // Establish dependency chains
      Object.entries(deployManifest.publish).forEach(([key, value]) => {
        const thisHandler = handlers[key];

        if (value.publish) {
          // Depends on other publish step
          handlers[value.publish].addNext(thisHandler);
        } else if (typeof value.deployment === "string") {
          // Depends on deploy step
          roots.push({
            uri: deployments[value.deployment],
            handler: thisHandler,
          });
        } else if (typeof value.deployment === "object") {
          // It is a root node
          roots.push({ uri: value.deployment.uri, handler: thisHandler });
        } else {
          throw new Error("Needs either previous step or URI");
        }
      });

      // Execute roots

      const uris: string[][] = [];

      for await (const root of roots) {
        uris.push(await root.handler.handle(root.uri));
      }

      print.table(uris);
    }

    process.exitCode = 0;
  },
};

function validateDeployParams(
  print: GluegunPrint,
  params: {
    manifestFile: unknown;
    path: unknown;
    name: unknown;
    cid: unknown;
  }
): boolean {
  const { manifestFile, path } = params;

  if (manifestFile === true) {
    const manifestPathMissingMessage = intlMsg.commands_build_error_manifestPathMissing(
      {
        option: "--manifest-file",
        argument: `<${pathStr}>`,
      }
    );
    print.error(manifestPathMissingMessage);
    return false;
  }

  if (path === true) {
    const pathMissingMessage = intlMsg.commands_deploy_error_pathMissing({
      option: "--path",
      argument: `<${pathStr}>`,
    });
    print.error(pathMissingMessage);
    return false;
  }

  return true;
}

function sanitizePackages(packages: { deploy: string[]; publish: string[] }) {
  const unrecognizedPackages: string[] = [];

  const availableDeployers = fs.readdirSync(
    path.join(__dirname, "..", "deployers")
  );

  const availablePublishers = fs.readdirSync(
    path.join(__dirname, "..", "publishers")
  );

  packages.deploy.forEach((p) => {
    if (!availableDeployers.includes(p)) {
      unrecognizedPackages.push(p);
    }
  });

  packages.publish.forEach((p) => {
    if (!availablePublishers.includes(p)) {
      unrecognizedPackages.push(p);
    }
  });

  if (unrecognizedPackages.length) {
    throw new Error(
      `Unrecognized packages: ${unrecognizedPackages.join(", ")}`
    );
  }
}

function getPublisher(name: string): Publisher {}
function getDeployer(name: string): Deployer {}
