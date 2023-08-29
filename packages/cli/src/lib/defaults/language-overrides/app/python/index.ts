import { CodegenOverrides } from "../../../../codegen";
import { PolywrapProject } from "../../../../project";

import fs from "fs";
import path from "path";

export function getCodegenOverrides(): CodegenOverrides {
  return {
    getSchemaBindConfig: async (project: PolywrapProject) => {
      const manifestPath = project.getManifestPath();
      const manifestDir = path.dirname(manifestPath);
      const pyprojectPath = path.join(manifestDir, "pyproject.toml");

      const pyproject = fs.readFileSync(pyprojectPath, "utf8");
      const match = pyproject.match(/name = "([A-Za-z0-9-]+)"/);
      if (!match || !match[1]) {
        return {};
      }

      const codegenDir = path.join(manifestDir, match[1], "wrap");

      return {
        codegenDir,
      };
    },
  };
}
