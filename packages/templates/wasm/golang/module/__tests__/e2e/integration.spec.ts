import * as App from "../types/wrap";
import path from "path";

jest.setTimeout(60000);

describe("Template Wrapper End to End Tests", () => {

  let template: App.Template;
  let wrapperUri: string;

  beforeAll(() => {
    const wrapperPath: string = path.join(__dirname, "..", "..", "..");
    wrapperUri = `fs/${wrapperPath}/build`;
    template = new App.Template(undefined, undefined, wrapperUri)
  })

  it("calls sampleMethod", async () => {
    const expected: string = "polywrap";

    const result = await template.sampleMethod({ arg: expected })

    if (!result.ok) throw result.error;
    expect(result.value.result).toEqual(expected);
  });
});
