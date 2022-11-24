import { Uri } from "@polywrap/core-js";
import path from "path";
import { parseWrapperEnvsOption } from "../../../lib";

describe("unit tests for option-parsers", () => {
  describe("wrapper-envs", () => {
    it("Should return undefined when no filename is provided", async () => {
      const envs = await parseWrapperEnvsOption(undefined);

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
        "./samples/wrapper-env.json"
      );

      const envs = await parseWrapperEnvsOption(wrapperEnvsFilePath);

      expect(envs).toEqual([
        {
          uri: Uri.from("wrap://ens/hello-world.polywrap.eth"),
          env: {
            foo: "bar",
          },
        },
        {
          uri: Uri.from("ens/ethereum.polywrap.eth"),
          env: {
            connection: {
              node: "https://mainnet.infura.io/v3/some_api_key",
              networkNameOrChainId: "mainnet",
            },
          },
        },
      ]);
    });
  });
});
