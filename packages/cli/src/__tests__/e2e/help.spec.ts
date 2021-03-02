import path from "path";
import { run, clearStyle } from "./utils";

const HELP = `
  w3             🔥 Web3API CLI 🔥                                      
  help (h)       -                                                    
  test-env (t)   Manage a test environment for Web3API                
  query (q)      Query Web3APIs using recipe scripts                  
  create (c)     Create a new project with w3 CLI                     
  codegen (g)    Auto-generate API Types                              
  build (b)      Builds a Web3API and (optionally) uploads it to IPFS 
`;

describe("e2e tests for no help", () => {
  test("Should display the help content", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "help"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toContain(HELP);
  });
});
