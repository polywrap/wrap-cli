import { exec as nodeExec } from "child_process";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const exec = (command: string, watch = false) => {
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

export const BASE_PACKAGE_JSON = {
  name: "@web3api/w3-testenv",
  version: "1.0.0",
  private: true,
  dependencies: {},
};
