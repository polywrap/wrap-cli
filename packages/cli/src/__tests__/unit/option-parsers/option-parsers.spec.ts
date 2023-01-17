import path from "path";
import { parseWrapperEnvsOption } from "../../../lib";

describe("unit tests for option-parsers", () => {
  describe("wrapper-envs", () => {
    const sampleFileEnvs = {
      "ens/ethereum.polywrap.eth": {
        connection: {
          networkNameOrChainId: "mainnet",
          node: "https://mainnet.infura.io/v3/some_api_key",
        },
      },
      "ens/hello-world.polywrap.eth": { foo: "bar" },
    };

    it("Should return undefined when undefined is provided for wrapperEnvsPath", async () => {
      const envs = await parseWrapperEnvsOption(undefined);

      expect(envs).toBeUndefined();
    });

    it("Should return undefined when false is provided for wrapperEnvsPath", async () => {
      const envs = await parseWrapperEnvsOption(false);

      expect(envs).toBeUndefined();
    });

    it("Should throw for a nonexistent wrapper-env file", async () => {
      const nonExistentFilePath = path.join(
        __dirname,
        "./samples/nonexistent.json"
      );

      await expect(async () => {
        await parseWrapperEnvsOption(nonExistentFilePath);
      }).rejects.toThrow();
    });

    it("Should return envs for a valid json file", async () => {
      const wrapperEnvsFilePath = path.join(
        __dirname,
        "./samples/wrapper-envs.json"
      );

      const envs = await parseWrapperEnvsOption(wrapperEnvsFilePath);

      expect(envs).toEqual(sampleFileEnvs);
    });

    it("Should return envs for a valid yaml file", async () => {
      const wrapperEnvsFilePath = path.join(
        __dirname,
        "./samples/wrapper-envs.yaml"
      );

      const envs = await parseWrapperEnvsOption(wrapperEnvsFilePath);

      expect(envs).toEqual(sampleFileEnvs);
    });
  });
});
