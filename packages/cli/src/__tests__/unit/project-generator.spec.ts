import path from "path";
import {
  generateProject,
  shouldUseYarn,
} from "../../lib/generators/project-generator";

const { filesystem } = require("gluegun");

describe("Project-generator validation", () => {
  const projectName = "test";
  const root = path.resolve(projectName);

  let command = `yarnpkg add --exact @web3api/templates --cwd ${root}`;
  if (!shouldUseYarn()) {
    command =
      "npm install --save --save-exact --loglevel error @web3api/templates";
  }

  it("Should fail with wrong type", async () => {
    await expect(() =>
      generateProject("wrongType", "assemblyscript", "test", filesystem)
    ).rejects.toMatchObject({
      command,
    });
  });

  it("Should fail with wrong language", async () => {
    await expect(() =>
      generateProject("plugin", "wrongLanguage", "test", filesystem)
    ).rejects.toMatchObject({
      command,
    });
  });
});
