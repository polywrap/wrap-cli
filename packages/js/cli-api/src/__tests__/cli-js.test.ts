import { awaitResponse, Commands, InfraActions } from "../../";

import path from "path";
import fs from "fs";

jest.setTimeout(300_000);

describe("cli-js tests", () => {

  const localIpfsNode = "http://localhost:5001";
  const wrapperPath = path.resolve(path.join(__dirname, "wrapper"));

  it("build", async () => {
    // clear build dir
    const buildDir = path.join(wrapperPath, "build");
    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true });
    }
    expect(fs.existsSync(buildDir)).toBeFalsy();

    // build
    await Commands.build({ strategy: "image" }, wrapperPath);

    // check for build dir and artifacts
    const wasmPath = path.join(buildDir, "wrap.wasm");
    const manifestPath = path.join(buildDir, "wrap.info");
    expect(fs.existsSync(buildDir)).toBeTruthy();
    expect(fs.existsSync(wasmPath)).toBeTruthy();
    expect(fs.existsSync(manifestPath)).toBeTruthy();
  });

  it("codegen", async () => {
    // clear wrap dir
    const wrapDir = path.join(wrapperPath, "src", "wrap");
    if (fs.existsSync(wrapDir)) {
      fs.rmSync(wrapDir, { recursive: true });
    }
    expect(fs.existsSync(wrapDir)).toBeFalsy();

    // codegen
    await Commands.codegen(undefined, wrapperPath);

    // check output
    expect(fs.existsSync(wrapDir)).toBeTruthy();
  });

  it.only("infra", async () => {
    // start infra
    await Commands.infra({ action: InfraActions.UP, verbose: true }, wrapperPath);
    const isInfraUp = await awaitResponse(localIpfsNode);
    expect(isInfraUp).toBeTruthy();

    // stop infra
    await Commands.infra({ action: InfraActions.DOWN, verbose: true }, wrapperPath);
    await new Promise((r) => setTimeout(r, 20000));
    const isInfraStillUp = await awaitResponse(localIpfsNode);
    expect(isInfraStillUp).toBeFalsy();
  });

  it("deploy", async () => {
    // start infra
    await Commands.infra({ action: InfraActions.UP }, wrapperPath);
    const isInfraUp = await awaitResponse(localIpfsNode);
    expect(isInfraUp).toBeTruthy();

    // clear output
    const outputFile = path.join(wrapperPath, "ipfs.json");
    if (fs.existsSync(outputFile)) {
      fs.rmSync(outputFile);
    }
    expect(fs.existsSync(outputFile)).toBeFalsy();
    
    // deploy wrapper
    await Commands.deploy({ outputFile }, wrapperPath);
    
    // check output
    expect(fs.existsSync(outputFile)).toBeTruthy();
  });


});