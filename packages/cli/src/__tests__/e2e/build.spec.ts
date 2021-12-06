import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import fs from "fs";
import path from "path";

const HELP = `
w3 build [options] [<web3api-manifest>]

Options:
  -h, --help                         Show usage information
  -i, --ipfs [<node>]                Upload build results to an IPFS node (default: dev-server's node)
  -o, --output-dir <path>            Output directory for build results (default: build/)
  -e, --test-ens <[address,]domain>  Publish the package to a test ENS domain locally (requires --ipfs)
  -w, --watch                        Automatically rebuild when changes are made (default: false)
  -v, --verbose                      Verbose output (default: false)

`;

describe("e2e tests for build command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--help"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - outputDir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--output-dir"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--output-dir option missing <path> argument
${HELP}`);
  });

  test("Should throw error for invalid params - testEns", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--test-ens"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--test-ens option missing <[address,]domain> argument
${HELP}`);
  });

  test("Should throw error for invalid params - ipfs", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--test-ens", "test.eth"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--test-ens option requires the --ipfs [<node>] option
${HELP}`);
  });

  test("Should throw error for invalid web3api - invalid route", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "invalid-web3api-1.yaml"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    const schemaPath = path.normalize(
      `${projectRoot}/src/wrong/schema.graphql`
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(
      `ENOENT: no such file or directory, open '${schemaPath}'`
    );
  });

  test("Should throw error for invalid web3api - invalid field", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "invalid-web3api-2.yaml"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(
      `instance is not allowed to have the additional property \"wrong_mutation\"`
    );
  });

  test("Successfully build the project", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["build", "-v"],
        cwd: projectRoot,
       cli: w3Cli,
      },
    );

    const manifestPath = "build/web3api.json";
    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("Artifacts written to ./build from the image `build-env`");
    expect(sanitizedOutput).toContain("Manifest written to ./build/web3api.json");
    expect(sanitizedOutput).toContain(manifestPath);
  });

  test("Successfully builds project w/ web3api.build.yaml but no dockerfile", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["build", "web3api.no-docker.yaml", "-v"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    const manifestPath = "build/web3api.json";
    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("Artifacts written to ./build from the image `build-env`");
    expect(sanitizedOutput).toContain("Manifest written to ./build/web3api.json");
    expect(sanitizedOutput).toContain(manifestPath);
  });

  test("Successfully builds project w/ web3api.build.yaml and linked packages", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["build", "web3api.linked-packages.yaml", "-v"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    const manifestPath = "build/web3api.json";
    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain(
      "Artifacts written to ./build from the image `build-env`"
    );
    expect(sanitizedOutput).toContain(
      "Manifest written to ./build/web3api.json"
    );
    expect(sanitizedOutput).toContain(manifestPath);
  });

  test("Successfully builds project w/ dockerfile", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["build", "web3api.docker.yaml", "-v"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    const manifestPath = "build/web3api.json";
    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("Artifacts written to ./build from the image `build-env`");
    expect(sanitizedOutput).toContain("Manifest written to ./build/web3api.json");
    expect(sanitizedOutput).toContain(manifestPath);
  });

  test("Successfully builds project w/ metadata", async () => {
    const { exitCode: code, stdout: output } = await runCLI({
      args: ["build", "web3api-meta.yaml", "-v"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    const manifestPath = "build/web3api.meta.json";
    const queryPath = "build/meta/queries/test.graphql";
    const queryVarPath = "build/meta/queries/test.json";
    const linkIconPath = "build/meta/links/link.svg";
    const iconPath = "build/meta/icon/icon.png";
    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("Artifacts written to ./build from the image `build-env`");
    expect(sanitizedOutput).toContain("Manifest written to ./build/web3api.json");
    expect(sanitizedOutput).toContain(manifestPath);
    expect(sanitizedOutput).toContain(queryPath);
    expect(sanitizedOutput).toContain(queryVarPath);
    expect(sanitizedOutput).toContain(linkIconPath);
    expect(sanitizedOutput).toContain(iconPath);

    expect(fs.existsSync(path.join(projectRoot, queryPath))).toBeTruthy();
    expect(fs.existsSync(path.join(projectRoot, queryVarPath))).toBeTruthy();
    expect(fs.existsSync(path.join(projectRoot, linkIconPath))).toBeTruthy();
    expect(fs.existsSync(path.join(projectRoot, iconPath))).toBeTruthy();
  });
});
