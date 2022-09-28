import { VMConfig } from "../../../../build-strategies/strategies/DockerVMStrategy";

const config: VMConfig = {
  defaultIncludes: ["package.json", "node_modules"],
  baseImage: "namesty/base-assemblyscript",
};

export default config;
