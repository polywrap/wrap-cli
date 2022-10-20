import { awaitResponse, runCLI } from "../../";

import path from "path";

jest.setTimeout(60_000);

describe("awaitResponse", () => {

  const localIpfsNode = "http://localhost:5001";
  const wrapperPath = path.resolve(path.join(__dirname, "wrapper"));

  it.only("returns false when infra is unavailable", async () => {
    const isInfraUp = await awaitResponse(localIpfsNode);
    expect(isInfraUp).toBeFalsy();
  });

  it("returns true when infra is available", async () => {
    await runCLI({
      args: ["infra", "up", "--verbose"],
      cwd: wrapperPath,
    });

    const isInfraUp = await awaitResponse(localIpfsNode);
    expect(isInfraUp).toBeTruthy();

    await runCLI({
      args: ["infra", "down", "--verbose"],
      cwd: wrapperPath,
    });
  });
});