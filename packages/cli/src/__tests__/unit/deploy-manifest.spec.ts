import { defaultDeployManifest, loadDeployManifest, Logger } from "../../lib";

describe("default deploy manifest", () => {
  const logger = new Logger({});

  it("should load a default deploy manifest when none exists", async () => {
    const manifest = await loadDeployManifest("polywrap.deploy.yaml", logger);

    expect(manifest).toEqual(defaultDeployManifest);
  });
});
