import { MiddlewareHandler } from "../lib/middleware";

import { GluegunToolbox } from "gluegun";

module.exports = (toolbox: GluegunToolbox): void => {
  toolbox.middleware = new MiddlewareHandler();
};
