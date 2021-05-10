/* eslint-disable @typescript-eslint/no-explicit-any */
import YAML from "js-yaml";
import fs from "fs";
import path from "path";
import { exec as nodeExec } from "child_process";
import rimraf from "rimraf";

export const BASE_PACKAGE_JSON = {
  name: "@web3api/w3-testenv",
  version: "1.0.0",
  private: true,
  dependencies: {},
};

interface Manifest {
  dockerCompose: Record<string, any>;
  modules?: {
    [key: string]: {
      module: string;
      version: string;
    };
  };
}

interface DockerCompose {
  services: {
    [key: string]: {
      build?:
        | string
        | {
            context: string;
          };
    };
  };
}

const TESTENV_DIR_PATH = path.join(".w3", "testenv");
const BASE_COMPOSE_FILE_PATH = path.join(
  TESTENV_DIR_PATH,
  "docker-compose.yml"
);

const exec = (command: string, watch = false) => {
  return new Promise<string>((res) => {
    const process = nodeExec(command);

    process.stdout?.on("data", (data) => {
      if (watch) {
        console.log(data.toString());
      }
    });

    process.stderr?.on("data", (data) => {
      if (watch) {
        console.log(data.toString());
      }
    });

    process.on("exit", () => {
      res("");
    });
  });
};

export const validateNoBuildArg = (manifest: Manifest): void => {
  const services: { build?: any }[] = Object.values(
    manifest.dockerCompose.services
  );

  if (!services.length) {
    return;
  }

  services.forEach((service) => {
    if (service.build) {
      throw new Error(
        `docker-compose's service "build" option is not supported. Please use "image" option instead.`
      );
    }
  });
};

export const parseManifest = <T extends Record<string, any>>(
  manifestPath: string
): T => {
  return YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8")) as T;
};

const correctBuildImageOptionPaths = (
  dockerComposePath: string
): DockerCompose => {
  const dockerComposeFile = parseManifest<DockerCompose>(dockerComposePath);

  const correctedServiceEntries = Object.entries(
    dockerComposeFile.services || {}
  ).map(([serviceName, value]) => {
    if (!value.build) {
      return [serviceName, value];
    }

    if (typeof value.build === "string") {
      return [
        serviceName,
        {
          ...value,
          build: path.join(
            process.cwd(),
            path.join(path.join(dockerComposePath, ".."), value.build)
          ),
        },
      ];
    } else {
      return [
        serviceName,
        {
          ...value,
          build: {
            ...value.build,
            context: path.join(
              process.cwd(),
              path.join(dockerComposePath, "..")
            ),
          },
        },
      ];
    }
  });

  return {
    ...dockerComposeFile,
    services: Object.fromEntries(correctedServiceEntries),
  };
};

const installModules = async (
  modules: {
    module: string;
    version: string;
  }[]
) => {
  //Compose package.json under .w3 folder and install deps
  const packageJSON = {
    ...BASE_PACKAGE_JSON,
    dependencies: modules.reduce((acc, current) => {
      acc[current.module] = current.version;
      return acc;
    }, {} as Record<string, any>),
  };

  fs.writeFileSync(
    path.join(TESTENV_DIR_PATH, "package.json"),
    JSON.stringify(packageJSON)
  );
  await exec(`cd ${TESTENV_DIR_PATH} && npm i`);

  const nodeModulesPath = path.join(TESTENV_DIR_PATH, "node_modules");

  modules.forEach((m) => {
    const moduleDir = path.join(nodeModulesPath, m.module);

    //Adjust module's docker-compose's build option if it exists
    const dockerComposePath = path.join(moduleDir, "docker-compose.yml");

    if (!fs.existsSync(dockerComposePath)) {
      throw new Error(
        `Module "${m.module}" does not contain a docker-compose.yml file at top level`
      );
    }

    const composeFileWithCorrectPaths = correctBuildImageOptionPaths(
      dockerComposePath
    );

    //Ovewrite old docker-compose with corrected version
    const newComposeFile = YAML.dump(composeFileWithCorrectPaths);
    fs.writeFileSync(dockerComposePath, newComposeFile);
  });

  return packageJSON;
};

export const extractDockerComposeFiles = async (
  modulesToExtract?: string[]
): Promise<string[]> => {
  if (fs.existsSync(TESTENV_DIR_PATH)) {
    rimraf.sync(TESTENV_DIR_PATH);
  }

  fs.mkdirSync(TESTENV_DIR_PATH, { recursive: true });

  const manifest = parseManifest<Manifest>("./web3api.env.yaml");
  const modules = manifest.modules || {};
  await installModules(Object.values(modules));

  const filteredModules = modulesToExtract
    ? Object.keys(modules).filter((key) => modulesToExtract.includes(key))
    : Object.keys(modules);
  const modulesExtracted = filteredModules.map(
    (moduleName) => modules[moduleName].module
  );

  return modulesExtracted.map((module) => {
    return path.join(
      TESTENV_DIR_PATH,
      "node_modules",
      module,
      "docker-compose.yml"
    );
  });
};

export const generateBaseDockerCompose = (): string => {
  const manifest = parseManifest<Manifest>("./web3api.env.yaml");
  const fileContent = YAML.dump(manifest.dockerCompose);

  fs.writeFileSync(BASE_COMPOSE_FILE_PATH, fileContent);

  return BASE_COMPOSE_FILE_PATH;
};

export const generateDockerManifests = async (
  modulesToUse?: string[]
): Promise<{ modulePaths: string[]; basePath: string }> => {
  const paths = await extractDockerComposeFiles(modulesToUse);
  const basePath = generateBaseDockerCompose();

  return {
    modulePaths: paths,
    basePath,
  };
};

const generateBaseComposedCommand = async (modulePaths: string[]) => {
  return `docker-compose -f ${BASE_COMPOSE_FILE_PATH} ${modulePaths
    .map((path) => ` -f ${path}`)
    .join("")}`;
};

interface Options {
  modules?: string[];
  watch?: boolean;
}

interface TestEnvOptions extends Options {
  detached?: boolean;
}

export const up = async (options: TestEnvOptions): Promise<void> => {
  const { modulePaths: paths } = await generateDockerManifests(options.modules);
  const baseCommand = await generateBaseComposedCommand(paths);

  await exec(
    `${baseCommand} up ${options.detached ? "-d" : ""} --build`,
    options.watch
  );
};

export const down = async (options: TestEnvOptions): Promise<void> => {
  const { modulePaths: paths } = await generateDockerManifests();
  const baseCommand = await generateBaseComposedCommand(paths);

  await exec(`${baseCommand} down`, options.watch);
};

export const getAggregatedManifest = async (
  options: Options
): Promise<string> => {
  const { modulePaths: paths } = await generateDockerManifests(options.modules);
  const baseCommand = await generateBaseComposedCommand(paths);
  return await exec(`${baseCommand} config`, options.watch);
};

export const getEnvVariables = async (options: Options): Promise<string[]> => {
  //Matches ${...} syntax
  const envVarRegex = /\${([^}]+)}/gm;
  const dockerComposePaths = await extractDockerComposeFiles(options.modules);

  const vars = dockerComposePaths.reduce((acc, current) => {
    const rawManifest = fs.readFileSync(current, "utf-8");
    const matches = rawManifest.match(envVarRegex) || [];

    return [
      ...acc,
      ...matches.map((match) => {
        if (match.startsWith("$")) {
          if (match.startsWith("${")) {
            return match.slice(2, match.length - 1);
          }

          return match.slice(1);
        }

        return match;
      }),
    ];
  }, [] as string[]);

  return Array.from(new Set(vars));
};
