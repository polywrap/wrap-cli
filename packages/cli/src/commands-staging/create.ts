import { generateProject } from "../lib/generators/project-generator";

import { GluegunToolbox } from "gluegun";

export default {
  alias: ["c"],
  description: "Create a new project with w3 CLI",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, strings, print, runtime, prompt, filesystem } = toolbox;
    const { isBlank } = strings;

    // grab the project name
    const projectName = (parameters.first || "").toString();
    if (isBlank(projectName)) {
      print.info(`${runtime!.brand} create <projectName>\n`);
      print.error("Project name is required");
      process.exit(5);
    }

    // check if project already exists
    if (!filesystem.exists(projectName)) {
      print.newline();
      print.info(`Setting up everything...`);

      generateProject(projectName, filesystem);

      print.newline();
    } else {
      print.info(`Directory with name ${projectName} already exists`);
      const overwrite = await prompt.confirm("Do you want to overwrite this directory?");
      if (overwrite) {
        print.info(`Overwriting ${projectName}...`);
        filesystem.remove(projectName);
        generateProject(projectName, filesystem);
      } else {
        process.exit(8);
      }
    }
    print.info(`🔥 You are ready to turn your Protocol into a Web3API 🔥`);
  },
};
