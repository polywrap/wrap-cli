/* eslint-disable @typescript-eslint/no-explicit-any */
import YAML from "js-yaml";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

interface Manifest {
  [key: string]: any;
  modules?: {
    [key: string]: {
      module: string;
      version: string;
      env: Record<string, any>[];
    };
  };
}

const BASE_COMPOSE_DIR_PATH = path.join(__dirname, ".w3", "testenv");
const BASE_COMPOSE_FILE_PATH = path.join(
  BASE_COMPOSE_DIR_PATH,
  "docker-compose.yml"
);

export const parseManifest = (
  manifestPath = "./web3api.env.yaml"
): Manifest => {
  return YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8")) as Manifest;
};

export const extractDockerComposePaths = (): string[] => {
  const manifest = parseManifest();
  const modules =
    Object.values(manifest.modules).map((module) => module.module) || [];

  return modules.map((module) => {
    return path.join(
      __dirname,
      "..",
      "..",
      "node_modules",
      module,
      "docker-compose.yml"
    );
  });
};

export const generateBaseDockerCompose = (): void => {
  if (!fs.existsSync(BASE_COMPOSE_DIR_PATH)) {
    fs.mkdirSync(BASE_COMPOSE_DIR_PATH, { recursive: true });
  }

  const manifest = parseManifest();

  if (manifest.modules) {
    delete manifest.modules;
  }

  const fileContent = YAML.dump(manifest);

  fs.writeFileSync(BASE_COMPOSE_FILE_PATH, fileContent);
};

export const executeCommand = (command: string): void => {
  generateBaseDockerCompose();

  const paths = extractDockerComposePaths();
  const baseCommand = `docker-compose -f ${BASE_COMPOSE_FILE_PATH} ${paths
    .map((path) => ` -f ${path}`)
    .join("")}`;

  execSync(`${baseCommand} ${command}`, { stdio: "inherit" });
};

executeCommand("up");
