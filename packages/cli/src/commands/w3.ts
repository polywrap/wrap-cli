import { GluegunToolbox } from "gluegun";

export default {
  alias: [],
  description: "🔥 Web3API CLI 🔥",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { print, parameters } = toolbox;
    if (parameters.first !== undefined) {
      print.error(`w3 ${parameters.first} is not a command`);
    } else {
      print.success(`Type ${print.colors.blue("w3 help")} to view common commands`);
    }
  },
};
