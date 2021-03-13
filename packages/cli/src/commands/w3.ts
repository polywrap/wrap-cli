import { getIntl } from "../lib/internationalization";

import { defineMessage } from "@formatjs/intl";
import { GluegunToolbox } from "gluegun";

const intl = getIntl();

export default {
  alias: [],
  description: "🔥 Web3API CLI 🔥",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { print, parameters } = toolbox;
    if (parameters.first !== undefined) {
      const errorMessage = intl.formatMessage({
        id: "commands_w3_error_notACommand",
        defaultMessage: "is not a command",
        description: "[command] is not a valid command",
      });
      print.error(`w3 ${parameters.first} ${errorMessage}`);
    } else {
      const successMessage = defineMessage({
        id: "commands_w3_helpPrompt",
        defaultMessage: "Type {command} to view common commands",
        description: "resolves to 'Type w3 help to view common commands'",
      });
      print.success(
        intl.formatMessage(successMessage, {
          command: `${print.colors.blue("w3 help")}`,
        })
      );
    }
  },
};
