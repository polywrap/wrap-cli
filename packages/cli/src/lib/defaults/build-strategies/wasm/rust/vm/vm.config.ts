import { VMConfig } from "../../../../build-strategies/strategies/DockerVMStrategy";

const config: VMConfig = {
  defaultIncludes: ["Cargo.toml", "Cargo.lock"],
  baseImage: "namesty/base-rust",
};

export default config;
