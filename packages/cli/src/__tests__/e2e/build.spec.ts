import { execSync, spawn } from "child_process";

describe("e2e tests for build command", () => {
  test("succesfull request with response type as TEXT", () => {
    const child = spawn("npx w3 build");
    child.on("close", (code) => {
      console.log(code, child.stdout.read());
    });
  });
});
