import chalk from "chalk";
import path from "path";
import { supportedLangs } from "../../commands/create";
import run from "./run";

const HELP = `${chalk["reset"](`
w3 create command <project-name> [options]`)}

${chalk["reset"](`Commands:
  api <lang>     Create a Web3API project
    langs: ${supportedLangs.api.join(", ")}
  app <lang>     Create a Web3API application
    langs: ${supportedLangs.app.join(", ")}
  plugin <lang>  Create a Web3API plugin
    langs: ${supportedLangs.plugin.join(", ")}`)}

${chalk["reset"](`Options:
  -h, --help               Show usage information
  -o, --output-dir <path>  Output directory for the new project
`)}
`;

describe("e2e tests for create command", () => {
  test("Should show help text", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "create", "--help"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(output).toEqual(HELP);
  });
});
