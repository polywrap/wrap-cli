import { getIntl } from "../lib/internationalization";

import { GluegunToolbox } from "gluegun";

export default {
  alias: [],
  description: "🔥 Web3API CLI 🔥",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { print, parameters } = toolbox;
    if (parameters.first !== undefined) {
      print.error(`w3 ${parameters.first} is not a command`);
    } else {
      const intl = await getIntl("es");
      print.success(
        intl.formatMessage(
          {
            id: "typeToViewCommands",
            defaultMessage: "Type {phrase} to view common commands",
            description: "type phrase to view commands",
          },
          { phrase: `${print.colors.blue("w3 help")}` }
        )
        //`Type ${print.colors.blue("w3 help")} to view common commands`
      );
    }
  },
};
