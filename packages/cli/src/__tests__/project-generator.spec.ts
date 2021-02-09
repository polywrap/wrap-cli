import path from "path";
import {
  generateProject,
  shouldUseYarn,
} from "../lib/generators/project-generator";

const { filesystem } = require("gluegun");

describe("Project-generator validation", () => {
  const projectName = "test";

  it("Should fail with wrong type", async () => {
    const root = path.resolve(projectName);

    let command = `yarnpkg add --exact @web3api/templates --cwd ${root}`;
    if (!shouldUseYarn()) {
      command =
        "npm install --save --save-exact --loglevel error @web3api/templates";
    }
    await expect(() =>
      generateProject("wrongType", "assemblyscript", "test", filesystem)
    ).rejects.toMatchObject({
      command,
    });
  });

  it("Should fail with wrong language", async () => {
    const root = path.resolve(projectName);

    let command = `yarnpkg add --exact @web3api/templates --cwd ${root}`;
    if (!shouldUseYarn()) {
      command =
        "npm install --save --save-exact --loglevel error @web3api/templates";
    }
    await expect(() =>
      generateProject("wrongType", "assemblyscript", "test", filesystem)
    ).rejects.toMatchObject({
      command,
    });
  });
});
