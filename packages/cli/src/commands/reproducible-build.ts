import { withSpinner } from "../lib/helpers/spinner";
import { copyDir } from "../lib/helpers/copy";

import { GluegunToolbox } from "gluegun";
import chalk from "chalk";
import { exec, ExecException } from "child_process";
import path from "path";
import YAML from "js-yaml";
import { copyFileSync, readFileSync, statSync } from "fs";
import rimraf from "rimraf";

const HELP = `
${chalk.bold("w3 reproducible-build")} command

Commands:
  ${chalk.bold("build")}    Build source files in Docker environment
`;

interface BuildManifest {
  image: {
    dockerfile?: string;
    name: string;
  };
  env: {
    [key: string]: string | string[];
    sources: string[];
    outputDir: string;
    script: string;
  };
}

const BASE_DOCKERFILE_PATH = path.join(
  __dirname,
  "..",
  "lib",
  "env",
  "build-env"
);

export default {
  alias: ["t"],
  description: "Manage a test environment for Web3API",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, print } = toolbox;
    const command = parameters.first;
    const { quiet } = parameters.options;

    if (!command) {
      print.error("No command given");
      print.info(HELP);
      return;
    }

    if (command === "build") {
      const doc = YAML.safeLoad(
        readFileSync("./web3api.build.yaml", "utf8")
      ) as BuildManifest;

      const tempDirPath = path.join(process.cwd(), ".w3", "temp");

      const buildArgsString = transformEnvToArgs(doc.env);

      const { dockerfile: userDockerfile, name: imageName } = doc.image;

      const dockerFilePath = userDockerfile || BASE_DOCKERFILE_PATH;

      print.newline();
      print.info(`Copying sources...`);

      copyDir(dockerFilePath, path.join(tempDirPath));
      copyFileSync(
        doc.env.script,
        path.join(tempDirPath, path.basename(doc.env.script))
      );

      doc.env.sources.forEach((source) => {
        const isDir = statSync(source).isDirectory();

        if (isDir) {
          copyDir(source, path.join(tempDirPath, path.basename(source)));
        } else {
          copyFileSync(source, path.join(tempDirPath, path.basename(source)));
        }
      });

      try {
        await withSpinner(
          "Building project...",
          "Failed to build project",
          "Warning building project",
          async (_spinner) => {
            await runCommand(
              `cd ${tempDirPath} && docker build --no-cache -t ${imageName} . ${buildArgsString} && \
              docker create -ti --name temp ${imageName} && \
              docker cp temp:/app/build ${path.join(
                "..",
                "..",
                doc.env.outputDir
              )} && \
              docker rm -f temp`,
              JSON.parse(quiet)
            );
          }
        );
      } catch (e) {
        print.error(e);
      }

      print.newline();
      print.info(`Removing temp folder...`);

      try {
        rimraf.sync(tempDirPath);
      } catch (e) {
        console.log(e);
      }
    } else {
      throw Error("This should never happen...");
    }
  },
};

async function runCommand(command: string, quiet = true) {
  if (!quiet) {
    console.log(`> ${command}`);
  }

  return new Promise<void>((resolve, reject) => {
    const callback = (
      err: ExecException | null,
      stdout: string,
      stderr: string
    ) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        if (!quiet) {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        }

        resolve();
      }
    };

    exec(command, { cwd: __dirname }, callback);
  });
}

function transformEnvToArgs(env: Record<string, string | string[]>): string {
  return Object.entries(env)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `--build-arg ${key}=${value}`;
      } else if (Array.isArray(value)) {
        return `--build-arg ${key}="${value.join(" ")}"`;
      } else {
        throw new Error(
          "Unsupported env variable type. Supported types: string, string[]"
        );
      }
    })
    .join(" ");
}
