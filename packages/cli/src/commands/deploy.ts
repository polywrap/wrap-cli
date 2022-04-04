/* eslint-disable prefer-const */
import {
  intlMsg,
  defaultBuildPath,
  Web3ApiProject,
  defaultWeb3ApiManifest,
  resolvePathIfExists,
} from "../lib";
import { DeploymentManager } from "../lib/deploy/DeploymentManager";
import { convertDirectoryToEntry } from "../lib/deploy/file";

import chalk from "chalk";
import { GluegunToolbox, GluegunPrint } from "gluegun";

const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");
const defaultOutputDirectory = defaultBuildPath;
const optionsStr = intlMsg.commands_deploy_options_options();
const pathStr = intlMsg.commands_deploy_options_o_path();
const strStr = intlMsg.commands_deploy_options_o_string();

const HELP = `
${chalk.bold("w3 deploy")} [${optionsStr}]

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                         ${intlMsg.commands_deploy_options_h()}
  -m, --manifest-file <${pathStr}>         ${intlMsg.commands_deploy_options_m({
  default: defaultManifestStr,
})}
  -n, --name <${strStr}>                       ${intlMsg.commands_deploy_options_n()}
  -c, --cid <${strStr}>                     ${intlMsg.commands_deploy_options_c()}
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

    const deploymentManager = new DeploymentManager(project, deployManifest);

    await deploymentManager.installPackages(name);

    const deployment = deploymentManager.getDeployment(name);

    if (!deployment.deployer && !cid) {
      throw new Error(
        `No deploy stage is present in deployment '${name}', a cid arg is required for publish`
      );
    }

    const uris: string[][] = [];
    let deployResult: string | undefined;
    let publishResult: string | undefined;

    if (deployment.deployer) {
      const buildDirEntry = convertDirectoryToEntry(buildPath);

      try {
        deployResult = await deployment.deployer.deploy(
          buildDirEntry,
          deployment.deployerConfig
        );

        uris.push(["Deploy", deployResult]);
      } catch (e) {
        throw new Error(
          `Deployment '${name}' deploy stage failed. Error: ${e}`
        );
      }
    }

    if (deployment.publisher) {
      try {
        publishResult = await deployment.publisher.publish(
          deployResult ?? cid,
          deployment.deployerConfig
        );

        uris.push(["Publish", publishResult]);
      } catch (e) {
        throw new Error(
          `Deployment '${name}' publish stage failed. Error: ${e}`
        );
      }
    }

    print.success(`${intlMsg.commands_build_uriViewers()}:`);
    print.table(uris);

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
  const { manifestFile, path, name, cid } = params;

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

  if (name === true) {
    const nameMissingMessage = intlMsg.commands_deploy_error_nameMissing({
      option: "--name",
      argument: `<${strStr}>`,
    });
    print.error(nameMissingMessage);
    return false;
  }

  if (cid === true) {
    const cidPathMissingMessage = intlMsg.commands_deploy_error_cidMissing({
      option: "--cid",
      argument: `<${strStr}>`,
    });
    print.error(cidPathMissingMessage);
    return false;
  }

  return true;
}
