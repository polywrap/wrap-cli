import { VMConfig } from "../../../../build-strategies/strategies/DockerVMStrategy";

const config: VMConfig = {
  defaultIncludes: ["package.json", "package-lock.json", "yarn.lock"],
  baseImage: "namesty/base-assemblyscript",
};

export default config;
