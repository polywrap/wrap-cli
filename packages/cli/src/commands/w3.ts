import { intlMsg } from "../lib";

import { GluegunToolbox } from "gluegun";

export default {
  alias: [],
  description: "🔥 Web3API CLI 🔥",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { print, parameters } = toolbox;
    if (parameters.first !== undefined) {
      const errorMessage = intlMsg.commands_w3_error_notACommand();
      print.error(`w3 ${parameters.first} ${errorMessage}`);
    } else {
      print.success(
        intlMsg.commands_w3_helpPrompt({
          command: `${print.colors.blue("w3 help")}`,
        })
      );
    }
  },
};
