import { PolywrapClient } from "@polywrap/client-js";
import path from "path";

jest.setTimeout(60000);

describe("Template Wrapper End to End Tests", () => {

  const client: PolywrapClient = new PolywrapClient();
  let wrapUri = `file://${path.join(__dirname, "../../build")}`;

  it("invoke foo", async () => {
    const result = await client.invoke({
      uri: wrapUri,
      method: "foo",
      args: { bar: "bar" }
    });

    expect(result.ok).toBeFalsy();
    if (result.ok) return;
    expect(result.error?.toString()).toContain("Not implemented");
  });
});
